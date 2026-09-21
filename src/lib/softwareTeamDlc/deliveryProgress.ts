/**
 * Software Works — delivery progress roll-up (board chips, detail pane).
 *
 * Pure projection from existing pipeline items: how far a delivery has walked
 * the Product→Writer roster and whether the delivery-wide ship gate is ready.
 * No new stored state and no Host writes — everything derives on the fly.
 */

import {
  SOFTWARE_TEAM_ROLE_IDS,
  type SoftwareTeamRoleId,
} from "./roles";
import {
  softwareTeamDeliveryMembers,
  softwareTeamDeliveryShipFields,
  softwareTeamShipGate,
  type SoftwareTeamShipBlock,
} from "./shipGate";
import type { SoftwareTeamPipelineItem } from "./pipeline";

export type SoftwareTeamDeliveryProgress = {
  memberCount: number;
  /** Visited roles (roleId ∪ roleHistory across members) in roster order. */
  visitedRoles: SoftwareTeamRoleId[];
  visitedCount: number;
  rosterTotal: number;
  shipReady: boolean;
  shipBlocks: SoftwareTeamShipBlock[];
};

/** `null` when the delivery has no members (or the id is empty). */
export function softwareTeamDeliveryProgress(
  items: readonly SoftwareTeamPipelineItem[],
  deliveryId: string | null | undefined,
): SoftwareTeamDeliveryProgress | null {
  const members = softwareTeamDeliveryMembers(items, deliveryId);
  if (!members.length) return null;
  const fields = softwareTeamDeliveryShipFields(members);
  const gate = softwareTeamShipGate(fields);
  const visitedRoles = SOFTWARE_TEAM_ROLE_IDS.filter(
    (role) =>
      fields.roleId === role || fields.roleHistory.includes(role),
  );
  return {
    memberCount: members.length,
    visitedRoles,
    visitedCount: visitedRoles.length,
    rosterTotal: SOFTWARE_TEAM_ROLE_IDS.length,
    shipReady: gate.ok,
    shipBlocks: gate.blocks,
  };
}
