"use client";

import { useEffect, useMemo, useReducer, useSyncExternalStore } from "react";
import { questions } from "@/lib/questions";
import { computeResults } from "@/lib/scoring";
import { loadProgress, saveProgress, clearProgress } from "@/lib/storage";
import type { Screen } from "@/lib/types";
import WelcomeScreen from "./WelcomeScreen";
import QuestionScreen from "./QuestionScreen";
import ResultsScreen from "./ResultsScreen";

interface State {
  screen: Screen;
  name: string;
  currentIndex: number;
  answers: (number | null)[];
}

type Action =
  | { type: "HYDRATE"; state: State }
  | { type: "START"; name: string }
  | { type: "SELECT"; optionIndex: number }
  | { type: "NEXT" }
  | { type: "RESTART" };

function initialState(): State {
  return {
    screen: "welcome",
    name: "",
    currentIndex: 0,
    answers: Array(questions.length).fill(null),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "START":
      return { ...state, screen: "test", name: action.name };
    case "SELECT": {
      const answers = [...state.answers];
      answers[state.currentIndex] = action.optionIndex;
      return { ...state, answers };
    }
    case "NEXT": {
      const isLast = state.currentIndex === questions.length - 1;
      if (isLast) {
        return { ...state, screen: "results" };
      }
      return { ...state, currentIndex: state.currentIndex + 1 };
    }
    case "RESTART":
      return initialState();
    default:
      return state;
  }
}

const noopSubscribe = () => () => {};

/**
 * localStorage is only available on the client, so the first server-rendered
 * pass (and the client's first hydration pass, which must match it) always
 * reports `false`. useSyncExternalStore flips it to `true` right after
 * mount without needing a setState-in-effect.
 */
function useHasMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export default function IQTestApp() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const hydrated = useHasMounted();

  useEffect(() => {
    if (!hydrated) return;
    const saved = loadProgress();
    if (saved) {
      dispatch({
        type: "HYDRATE",
        state: {
          screen: saved.screen,
          name: saved.name,
          currentIndex: saved.currentIndex,
          answers: saved.answers,
        },
      });
    }
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (state.screen === "welcome") {
      clearProgress();
      return;
    }
    saveProgress({
      screen: state.screen,
      name: state.name,
      currentIndex: state.currentIndex,
      answers: state.answers,
    });
  }, [state, hydrated]);

  const results = useMemo(() => {
    if (state.screen !== "results") return null;
    return computeResults(state.answers, questions);
  }, [state.screen, state.answers]);

  if (!hydrated) return null;

  if (state.screen === "welcome") {
    return (
      <WelcomeScreen
        totalQuestions={questions.length}
        onStart={(name) => dispatch({ type: "START", name })}
      />
    );
  }

  if (state.screen === "test") {
    const question = questions[state.currentIndex];
    return (
      <QuestionScreen
        question={question}
        questionNumber={state.currentIndex + 1}
        totalQuestions={questions.length}
        selectedOption={state.answers[state.currentIndex]}
        onSelect={(optionIndex) => dispatch({ type: "SELECT", optionIndex })}
        onNext={() => dispatch({ type: "NEXT" })}
      />
    );
  }

  if (state.screen === "results" && results) {
    return (
      <ResultsScreen
        name={state.name}
        results={results}
        onRetake={() => dispatch({ type: "RESTART" })}
      />
    );
  }

  return null;
}
