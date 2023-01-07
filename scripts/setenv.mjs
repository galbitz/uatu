import pkg from "shelljs";
import git from "simple-git";

const { which, echo, exit, env, exec } = pkg;

if (!which("git")) {
  echo("Cannot build without git");
  exit(1);
}

async function getDescribe() {
  return await git().raw(["describe", "--always", "--dirty"]);
}

(async () => {
  try {
    env.REACT_APP_VERSION = await getDescribe();
    console.log("REACT_APP_VERSION set to ", env.REACT_APP_VERSION);

    const run = process.argv.splice(2).join(" ");
    exec(run);
  } catch (err) {
    echo("Failed to gather build info", err);
    exit(1);
  }
})();
