import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import InterestSignupModal from "@/components/InterestSignupModal";

export type SignupKind = "join" | "volunteer" | "class_registration" | "choose";

export interface SignupRequest {
  id: string;
  title: string;
  kind: SignupKind;
}

interface InterestSignupContextValue {
  openSignup: (request: SignupRequest) => void;
}

const InterestSignupContext = createContext<InterestSignupContextValue | null>(
  null
);

export function InterestSignupProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<SignupRequest | null>(null);
  const openSignup = useCallback((nextRequest: SignupRequest) => {
    setRequest(nextRequest);
  }, []);
  const contextValue = useMemo(() => ({ openSignup }), [openSignup]);

  return (
    <InterestSignupContext.Provider value={contextValue}>
      {children}
      <InterestSignupModal request={request} onClose={() => setRequest(null)} />
    </InterestSignupContext.Provider>
  );
}

export function useInterestSignup() {
  const context = useContext(InterestSignupContext);
  if (!context) {
    throw new Error(
      "useInterestSignup must be used within InterestSignupProvider."
    );
  }
  return context;
}
