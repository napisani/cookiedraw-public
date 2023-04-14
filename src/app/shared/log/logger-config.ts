export interface LoggerProperties {
  enableDebug: boolean;
  enableWarn: boolean;
  enableInfo: boolean;
  enableError: boolean;
  enableTrace: boolean;
}

export interface LoggerConfig {
  root: LoggerProperties;
  specific: { [key: string]: LoggerProperties };
}
