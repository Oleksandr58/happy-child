interface radio {
  SN: string;
  type: string;
  organism?: string;
  isRegistered: boolean;
  firmwares: string[];
}

export { type radio };
