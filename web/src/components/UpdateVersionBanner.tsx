import { useEffect, useState } from "react";
import * as api from "../helpers/api";
import * as storage from "../helpers/storage";
import Icon from "./Icon";
import "../less/about-site-dialog.less";

interface State {
  latestVersion: string;
  show: boolean;
}

const UpdateVersionBanner: React.FC = () => {
  const [state, setState] = useState<State>({
    latestVersion: "",
    show: false,
  });

  useEffect(() => {
    Promise.all([api.getRepoLatestTag(), api.getSystemStatus()])
      .then(
        ([
          latestTag,
          {
            data: {
              data: { profile },
            },
          },
        ]) => {
          const { skippedVersion } = storage.get(["skippedVersion"]);
          const latestVersion = latestTag.slice(1) || "0.0.0";
          const currentVersion = profile.version;
          const skipped = skippedVersion ? skippedVersion === latestVersion : false;
          setState({
            latestVersion,
            show: !skipped && currentVersion !== latestVersion,
          });
        }
      )
      .catch(() => {
        // do nth
      });
  }, []);

  const onSkip = () => {
    storage.set({ skippedVersion: state.latestVersion });
    setState((s) => ({
      ...s,
      show: false,
    }));
  };

  if (!state.show) return null;

  return (
    <div className="flex flex-row items-center justify-center w-full py-2 text-white bg-green-600">
      <a
        className="flex flex-row items-center justify-center hover:underline"
        target="_blank"
        href="https://github.com/usememos/memos/releases"
        rel="noreferrer"
      >
        <Icon.ArrowUpCircle className="w-5 h-auto mr-2" />
        New Update <span className="ml-1 font-bold">{state.latestVersion}</span>
      </a>
      <button className="absolute opacity-20 right-4 btn" title="Skip this version" onClick={onSkip}>
        <Icon.X />
      </button>
    </div>
  );
};

export default UpdateVersionBanner;
