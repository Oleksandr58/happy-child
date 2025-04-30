import * as React from "react";
import { getChannelAll } from "../http";
import { channel } from "../types/channel";

interface ArgsContext {
  channels: channel[];
  getChannels: () => void;
  setChannelId: (id: string | null) => void;
  channel?: channel;
}

const ChannelContext = React.createContext<ArgsContext>({
  channels: [],
  getChannels: () => {},
  setChannelId: () => {},
});

interface Args {
  children: React.ReactElement;
}

function ChannelProvider({ children }: Args) {
  const [channels, setChannels] = React.useState<channel[]>([]);
  const [channelId, setChannelId] = React.useState<string | null>(null);

  const getChannels = async () => {
    const { data } = await getChannelAll();
    setChannels(data);
  };

  const channel = channels?.data?.find(({ id }) => channelId === id);
  const channelTransformed = {
    ...channel,
    key: channel?.key?.id,
  };

  const value = {
    channels,
    getChannels,
    setChannelId,
    channel: channelTransformed,
  };

  return (
    <ChannelContext.Provider value={value}>{children}</ChannelContext.Provider>
  );
}

function useChannelContext() {
  const context = React.useContext(ChannelContext);

  if (context === undefined) {
    throw new Error("useCount must be used within a ChannelProvider");
  }

  return context;
}

export { ChannelProvider, useChannelContext };
