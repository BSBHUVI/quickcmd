# ⚡ quickcmd

[![npm version]](https://www.npmjs.com/package/bhuvi-quickcmd)
[![downloads]](https://www.npmjs.com/package/bhuvi-quickcmd)
[![license]](https://github.com/BSBHUVI/quickcmd/blob/master/LICENSE)

> A terminal automation CLI that lets you create short commands for long repetitive scripts — Git, npm, CI, deployment commands and more.

---

## ✨ Why quickcmd?

If you find yourself repeatedly typing long terminal commands like:
or:
Then **quickcmd** saves you time by turning them into short reusable commands like:

---

## 📦 Installation

Install globally:

```sh
npm install -g quickcmd

## Development Only
npm link

## Create your config file:
quick init

## This creates:
~/.quickcmd.json
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
quick gp

## Runs 
git push

## ▶ Alias with variables
quick gpa "Fix sidebar bug" main
## If arguments are missing, quickcmd asks interactively:
Enter value for branchName:

```

## 📜 List all commands

```sh
quick list
```

## 🛠 Managing Commands from the CLI

➕ Add a new shortcut interactively

```sh
quick add
```

✏ Edit an existing shortcut

```sh
quick edit gpa
```

📂 Open your config file

```sh
quick open
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
