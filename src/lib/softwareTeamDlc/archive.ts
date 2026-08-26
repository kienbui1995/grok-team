/**
 * Software Works — archive / unarchive a delivery without deleting history.
 *
 * SoT v3 stores `archivedDeliveryIds`. Item `archived` is missing/false on
 * v1–v2 files. Activity stays on the store.
 */

import {
  appendSoftwareTeamPipelineActivity,
  softwareTeamArchivedDeliveryIds,
  softwareTeamPipelineActivity,
  type SoftwareTeamPipelineItem,
  type SoftwareTeamPipelineStore,
} from "./pipeline";

export function isSoftwareTeamItemArchived(
  item: Pick<SoftwareTeamPipelineItem, "archived" | "deliveryId">,
  archivedDeliveryIds: readonly string[] | undefined,
): boolean {
  const deliveryId = item.deliveryId.trim();
  if (deliveryId && (archivedDeliveryIds ?? []).includes(deliveryId)) {
    return true;
  }
  return item.archived === true;
}

export function setSoftwareTeamDeliveryArchived(
  store: SoftwareTeamPipelineStore,
  deliveryId: string,
  archived: boolean,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const id = deliveryId.trim();
  if (!id) return store;
  const current = softwareTeamArchivedDeliveryIds(store);
  const already = current.includes(id);
  if (already === archived) {
    const itemsAligned = store.items.every((item) =>
      item.deliveryId.trim() !== id ? true : item.archived === archived,
    );
    if (itemsAligned) return store;
  }
  const archivedDeliveryIds = archived
    ? already
      ? current
      : [...current, id]
    : current.filter((entry) => entry !== id);
  const items = store.items.map((item) =>
    item.deliveryId.trim() === id
      ? { ...item, archived, updatedAt: now }
      : item,
  );
  const first = items.find((item) => item.deliveryId.trim() === id);
  let next: SoftwareTeamPipelineStore = {
    items,
    activity: softwareTeamPipelineActivity(store),
    archivedDeliveryIds,
  };
  if (first) {
    next = appendSoftwareTeamPipelineActivity(next, {
      at: now,
      type: archived ? "archived" : "unarchived",
      deliveryId: id,
      itemId: first.id,
      roleId: first.roleId,
      stageId: first.stageId,
    });
  }
  return next;
}

export function setSoftwareTeamItemArchived(
  store: SoftwareTeamPipelineStore,
  itemId: string,
  archived: boolean,
  now = Date.now(),
): SoftwareTeamPipelineStore {
  const item = store.items.find((row) => row.id === itemId);
  if (!item) return store;
  const deliveryId = item.deliveryId.trim();
  if (deliveryId) {
    return setSoftwareTeamDeliveryArchived(store, deliveryId, archived, now);
  }
  if (item.archived === archived) return store;
  const items = store.items.map((row) =>
    row.id === itemId ? { ...row, archived, updatedAt: now } : row,
  );
  return appendSoftwareTeamPipelineActivity(
    {
      items,
      activity: softwareTeamPipelineActivity(store),
      archivedDeliveryIds: softwareTeamArchivedDeliveryIds(store),
    },
    {
      at: now,
      type: archived ? "archived" : "unarchived",
      deliveryId: "",
      itemId: item.id,
      roleId: item.roleId,
      stageId: item.stageId,
    },
  );
}
