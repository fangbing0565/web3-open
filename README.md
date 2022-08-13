# TTSPC

## overview
- [SSFM & TTSPC 前端技术方案](https://bytedance.feishu.cn/wiki/wikcnSheIPsWdLFsqqD8eOGPHEK?table=tbl0NuofRbzYpV9Y&view=vewJGGuix7)
- [新人指南](https://bytedance.feishu.cn/wiki/wikcnyz4S58o1xmQ1GyBpt3aBVd?table=tbl0NuofRbzYpV9Y&view=vewJGGuix7)
- [目录指南](https://bytedance.feishu.cn/wiki/wikcnDtvseUYVNQdwt8fgBFGAgg?table=tbl0NuofRbzYpV9Y&view=vewJGGuix7)
## Tech Stack

- [goofy studio](https://studio.goofy.app/)
- [Jupiter](https://jupiter.goofy.app/)
- [garrfish](https://garfish.bytedance.net/)


## Install
1. install `Node.js`: use 16.x version, download from [nodejs.org](https://nodejs.org/en/)
    - or use `nvm` to install,  project will auto switch to specific version with `.nvmrc`
2. install `pnpm`: `npm install -g pnpm@6.32.8`, specify version led team has some environment
3. init project: `pnpm install`


## Usage
Run subapp Only

```
pnpm dev home
```

IF you want to run subapp with main
```
pnpm dev main
pnpm dev product
```

You can see how many apps in [./apps](./apps) directory.


### Local config
1. Add your local whistle proxy key-value in [.proxy.js](./.proxy)
2. Change build env in [.env](./.env)


### Package Manage commands
1. install or update your packages in apps, not install in root
```
todo
```
2. install packages in root, not recommend, and only install devDependencies
```
pnpm install eslint -DW
```
3. recursive update/install if necessary,
```
pnpm -r update @oec-open/ttspc-config@x.x.x
```
4. run some command directly in apps , such as "type-check" or "lint"
```
pnpm --filter main run type-check
pnpm --filter home run lint
pnpm --filter approval run build -- --analyze // use analyze mode for build
```
5. Whistle handle
```
w2 status
w2 stop
```

