import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import InterestSignupModal from "@/components/InterestSignupModal";
import EngagementModal from "@/components/EngagementModal";
import { getEngagementById, type EngagementConfig } from "@/data/engagements";

export type SignupKind = "join" | "volunteer" | "class_registration" | "choose";

export interface SignupRequest {
  id: string;
  title: string;
  kind: SignupKind;
}

interface InterestSignupContextValue {
  openSignup: (request: SignupRequest) => void;
  openEngagement: (id: string, contextProjectTitle?: string) => void;
}

const InterestSignupContext = createContext<InterestSignupContextValue | null>(
  null
);

export function InterestSignupProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<SignupRequest | null>(null);
  const [engagementRequest, setEngagementRequest] = useState<{
    engagement: EngagementConfig;
    contextProjectTitle?: string;
  } | null>(null);
  const openSignup = useCallback((nextRequest: SignupRequest) => {
    setRequest(nextRequest);
  }, []);
  const openEngagement = useCallback(
    (id: string, contextProjectTitle?: string) => {
      const engagement = getEngagementById(id);
      if (!engagement) {
        throw new Error(`Unknown parish engagement form: ${id}`);
      }
      setEngagementRequest({ engagement, contextProjectTitle });
    },
    []
  );
  const contextValue = useMemo(
    () => ({ openSignup, openEngagement }),
    [openSignup, openEngagement]
  );

  return (
    <InterestSignupContext.Provider value={contextValue}>
      {children}
      <InterestSignupModal request={request} onClose={() => setRequest(null)} />
      {engagementRequest && (
        <EngagementModal
          isOpen
          onClose={() => setEngagementRequest(null)}
          engagement={engagementRequest.engagement}
          contextProjectTitle={engagementRequest.contextProjectTitle}
        />
      )}
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
