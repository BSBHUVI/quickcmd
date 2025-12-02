# ⚡ quickcmd

[![npm version]](https://www.npmjs.com/package/bhuvi-quickcmd)
[![downloads]](https://www.npmjs.com/package/bhuvi-quickcmd)
[![license]](https://github.com/BSBHUVI/quickcmd/blob/master/LICENSE)

> A terminal automation CLI that lets you create short commands for long repetitive scripts — Git, npm, CI, Docker deployment commands and more.

---

## ✨ 🚀 Why QuickCMD?

Running long or repetitive terminal commands slows developers down — especially when switching between projects, environments, or tools. Typing (or constantly copy-past­ing) commands like build scripts, SSH connections, docker containers, or dev servers becomes annoying and error-prone.

QuickCMD eliminates that friction.

With QuickCMD, you can create short, memorable aliases for complex commands and run them instantly from anywhere — just like shortcuts for your CLI. No more searching through terminal history or digging into docs.

---

## 📦 Installation

Install globally:

```sh
npm install -g quickcmd

## Create your config file:
q init

## This creates:
~/.quickcmd.json

```

## 📜 List all commands

```sh
q list
```

## 🛠 Managing Commands from the CLI

➕ Add a new shortcut Command interactively

```sh
q add
```

✏ Edit an existing shortcut Command

```sh
q edit gpa
```

```sh
## ⚙ Configuration Example
{
  "aliases": {
    "gp": "git push",

    "gpa": {
      "command": "npm run test:ci && git add . && git commit -m \"{{msg}}\" && git push origin \"{{branchName}}\"",
      "vars": ["msg", "branchName"],
      "description": "Test, commit with message, and push"
    },

    "deploy": {
      "modes": {
        "prod": "npm run build && git push origin main",
        "dev": "npm run dev"
      },
      "description": "Deployment scripts"
    },

    "f": "git fetch origin",
    "so": "git remote show origin"
  }
}
```

## 🚀 Usage Examples

```sh
## Run a simple alias
q gp

## Runs 
git push

## ▶ Alias with variables
q gpa "Fix sidebar bug" main
## If arguments are missing, quickcmd asks interactively:
Enter value for branchName:

```

## 🗑 Uninstall

```sh
npm uninstall -g quickcmd
```

## 🤝 Contributing

Pull requests are welcome!

If you'd like to contribute:

```sh
git clone https://github.com/BSBHUVI/quickcmd.git
npm install
npm run dev
```
