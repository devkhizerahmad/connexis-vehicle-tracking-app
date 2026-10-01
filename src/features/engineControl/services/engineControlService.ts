// engineControlService.ts — Engine Control data service.
// Mock today, API-ready signature: getEngineControlData().
// Source: engineControl.mock.json. The mock is the single source of truth for
// the reference layout — status copy, route order, FAQ wording and map framing
// are read verbatim and never recomputed.
import engineControlMock from '@features/engineControl/mocks/engineControl.mock.json';
import type {
  EngineControlData,
  EngineControlMockPayload,
} from '@features/engineControl/types/engineControl';

const mock = engineControlMock as unknown as EngineControlMockPayload;

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
};

export default engineControlService;
