// app.mjs
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { addNote, listNotes, readNote, removeNote } from "./notes.js";

const argv = yargs(hideBin(process.argv))
  .command("add", "Add a new note", (y) => {
    y.option("title", { describe: "Note title", type: "string", demandOption: true });
    y.option("body", { describe: "Note body", type: "string", demandOption: true });
  })
  .command("list", "List all notes")
  .command("read", "Read a note", (y) => {
    y.option("title", { describe: "Note title", type: "string", demandOption: true });
  })
  .command("remove", "Remove a note", (y) => {
    y.option("title", { describe: "Note title", type: "string", demandOption: true });
  })
  .demandCommand(1, "You must specify a command")
  .help()
  .alias("help", "h")
  .argv;

const cmd = argv._[0];

(async () => {
  try {
    if (cmd === "add") {
      const res = await addNote(argv.title, argv.body);
      if (res.success) console.log(chalk.green(res.message));
      else console.log(chalk.red(res.message));
    } else if (cmd === "list") {
      const notes = await listNotes();
      if (notes.length === 0) {
        console.log(chalk.yellow("No notes yet."));
        return;
      }
      console.log(chalk.blue.bold(`\nNotes (${notes.length}):\n`));
      notes.forEach((n, i) => {
        console.log(chalk.green(`${i + 1}. ${n.title}`));
        console.log(`   ${n.body}`);
        console.log(chalk.dim(`   created: ${n.createdAt}`));
      });
    } else if (cmd === "read") {
      const note = await readNote(argv.title);
      if (!note) {
        console.log(chalk.red("Note not found."));
        return;
      }
      console.log(chalk.blue.bold(`\n${note.title}\n`));
      console.log(note.body);
      console.log(chalk.dim(`\ncreated: ${note.createdAt}`));
    } else if (cmd === "remove") {
      const res = await removeNote(argv.title);
      if (res.success) console.log(chalk.green(res.message));
      else console.log(chalk.red(res.message));
    } else {
      console.log(chalk.yellow("Unknown command."));
    }
  } catch (err) {
    console.error("Error:", err.message || err);
  }
})();
