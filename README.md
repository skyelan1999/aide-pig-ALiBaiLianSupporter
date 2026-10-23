# ALiBaiLianSupporter

Aide 的阿里云百炼支持插件：离线官方刊例价、输入长度阶梯、思考模式输出单价与只读账户余额查询声明。MIT 许可。仓库名称保留用户指定的 `aide-pig-ALiBaiLianSupporter`。

需要支持 `providerSupport` protocol 1 的 Aide。安装并激活后，主机读取 `provider-support.json`；不注册 AI 工具，不向 JavaScript 暴露模型密钥或费用 AccessKey。

本版只匹配 `https://dashscope.aliyuncs.com` 的根路径、`/compatible-mode/v1` 和 `/api/v1`，只覆盖价格表中列出的北京模型名。未知名称、其他地域与代理端点继续使用用户设置的自定义费率。单位为人民币/百万 token；分档依据整次请求的输入总量，超过有界最大档不猜测价格。

千问档案采样日期为 2026-10-22；0.1.1 增补 2026-10-23 核验的北京 `glm-5.3`（输入 8、输出 28 元/百万 Token，思考和非思考同价，不分输入阶梯）。仅匹配该精确 ID，不将其价格套用于其他 GLM 名称。其余档案采用原价，更新通过插件包交付，不需要运行时联网抓取价格。`qwen-plus` 的思考模式单价与普通模式不同；主机无法确定模式时应采用较高价并标记估算。缓存折扣、显式缓存创建、批量折扣、免费额度与优惠不自动扣除，显示值不等于实际账单。

账户余额需要在 Aide 中另行配置仅有 `bssapi:QueryAccountBalance` 权限的 RAM AccessKey ID/Secret；模型 API Key 无法查询费用账户。凭证存入主机加密 vault。此版查询中国站费用账户，不适用于国际站。返回可用额度及现金余额，保留上游币种；未配置凭证是未配置状态，不显示虚构的零余额。插件没有环境变量或配置文件密钥入口。

官方来源、RAM 最小权限与限制见 [调研记录](docs/RESEARCH-20261022.md)。这不是阿里云官方发布的插件。

## 本地检查与打包

```sh
node --test test/catalog.test.cjs
python3 scripts/package.py
```

ZIP 仅含运行必需档案、入口、许可与文档，不含测试、凭证、Git 元数据或开发缓存。本轮未调用真实费用接口或付费模型。宿主集成验收与插件自身测试分别记录。

### 0.1.2
Supports Beijing workspace endpoints (`<workspace>.cn-beijing.maas.aliyuncs.com`) through Aide’s validated `workspaceRegion` matcher. Other regions remain excluded; no keys or workspace identifiers are stored in this catalog. Requires the corresponding Aide host adapter update.
