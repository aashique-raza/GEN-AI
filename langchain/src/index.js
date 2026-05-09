import { startInteractiveChat } from "./cli/startInteractiveChat.js";

// * index.js is only the app entry point.
// * All CLI logic lives inside src/cli/startInteractiveChat.js.
async function main() {
  await startInteractiveChat();
}

// ! Global error handler for unexpected crashes.
main().catch((error) => {
  console.error("App crashed:");
  console.error(error.message);
});