// engineControlService.ts — Engine Control data service.
// Mock today, API-ready signature: getEngineControlData().
// Source: engineControl.mock.json. The mock is the single source of truth for
// the reference layout — status copy, route order, FAQ wording and map framing
// are read verbatim and never recomputed.
import engineControlMock from '@features/engineControl/mocks/engineControl.mock.json';
import type {
  EngineControlData,
  EngineControlMockPayload,
  LockUnlockAction,
} from '@features/engineControl/types/engineControl';

const mock = engineControlMock as unknown as EngineControlMockPayload;

/**
 * PATCH EC-SWIPE: how long the fake lock/unlock call takes to settle. It is the
 * visible "processing" window during which the rail stays filled and any further
 * swipe or selection change is ignored.
 */
const LOCK_UNLOCK_LATENCY_MS = 800;

export const engineControlService = {
  /** Full Engine Control payload (vehicle, alert, map, routes, controls, FAQ). */
  getEngineControlData: async (): Promise<EngineControlData> => ({
    vehicle: mock.vehicle,
    alert: mock.alert,
    map: mock.map,
    changeFenceLabel: mock.changeFenceLabel,
    routesSectionTitle: mock.routesSectionTitle,
    routes: mock.routes,
    controlSectionTitle: mock.controlSectionTitle,
    controls: mock.controls,
    lockLabel: mock.lockLabel,
    unlockLabel: mock.unlockLabel,
    privacyLabel: mock.privacyLabel,
    slideLabel: mock.slideLabel,
    faqTitle: mock.faqTitle,
    faq: mock.faq,
    supportLabel: mock.supportLabel,
  }),

  /**
   * PATCH EC-SWIPE: the Lock / Unlock action seam.
   *
   * The signature is deliberately the shape the REAL endpoint will have — an
   * action in, the completed action back — so replacing the body with a network
   * call changes nothing at the call site. It resolves after a short delay so
   * the UI has a genuine in-flight window to render (and to be tested against),
   * rather than firing and resetting in the same frame.
   */
  requestLockUnlock: async (action: LockUnlockAction): Promise<LockUnlockAction> => {
    // TODO: replace with real lock/unlock API
    await new Promise<void>(resolve => {
      setTimeout(resolve, LOCK_UNLOCK_LATENCY_MS);
    });
    return action;
  },
};

export default engineControlService;
