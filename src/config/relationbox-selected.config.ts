/**
 * Interface configuration to show/hide only selected button for specified relation boxes
 */
export interface RelationBoxSelectedConfig {
  prefix: string;
  entries: RelationBoxSelectedEntryConfig[];
}

export interface RelationBoxSelectedEntryConfig {
  configuration: string;
  relationLeftType: string;
}
