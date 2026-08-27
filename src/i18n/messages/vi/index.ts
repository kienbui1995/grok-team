/** Merged vi message catalog by domain. */
import { viCore } from "./core";
import { viSidebar } from "./sidebar";
import { viProject } from "./project";
import { viSession } from "./session";
import { viChat } from "./chat";
import { viErrors } from "./errors";
import { viComposer } from "./composer";
import { viWorkspace } from "./workspace";
import { viTasks } from "./tasks";
import { viSlash } from "./slash";
import { viAccount } from "./account";
import { viProviders } from "./providers";
import { viDoctor } from "./doctor";
import { viExtensions } from "./extensions";
import { viAutomations } from "./automations";
import { viFeatures } from "./features";
import { viKanban } from "./kanban";
import { viSettings } from "./settings";
import { viSettingsUi } from "./settings-ui";
import { viSettingsAgent } from "./settings-agent";
import { viSettingsMemory } from "./settings-memory";
import { viSettingsCode } from "./settings-code";
import { viSettingsRemoteIm } from "./settings-remoteIm";
import { viSettingsPet } from "./settings-pet";
import { viSoftwareTeamDlc } from "./software-team-dlc";

import type { MessageKey } from "../en";

export const vi: Record<MessageKey, string> = {
  ...viCore,
  ...viSidebar,
  ...viProject,
  ...viSession,
  ...viChat,
  ...viErrors,
  ...viComposer,
  ...viWorkspace,
  ...viTasks,
  ...viSlash,
  ...viAccount,
  ...viProviders,
  ...viDoctor,
  ...viExtensions,
  ...viAutomations,
  ...viFeatures,
  ...viKanban,
  ...viSettings,
  ...viSettingsUi,
  ...viSettingsAgent,
  ...viSettingsMemory,
  ...viSettingsCode,
  ...viSettingsRemoteIm,
  ...viSettingsPet,
  ...viSoftwareTeamDlc,
};
