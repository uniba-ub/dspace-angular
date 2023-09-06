/**
 * Interface configuration to define the rendering for tree metrics and the order of the metrics badges shown and additional the tooltip and position
 * orgunittree; persons;
 */
export interface TreeRenderingConfig {
  entries: TreeRenderingEntriesConfig[];
}

export interface TreeRenderingEntriesConfig {
  treename: string;
  renderings: TreeRenderingEntryConfig[];
  entityicons: TreeRenderingEntityIconEntryConfig[];
}

export interface TreeRenderingEntryConfig {
  key: string;
  icon: string;
  tooltip?: string;
  hidezero?: boolean;
}

export interface TreeRenderingEntityIconEntryConfig {
  key: string;
  icon: string;
}
