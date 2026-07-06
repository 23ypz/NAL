// Lightweight parser for backend/config/system.rules.
// Grammar:
//   Program  -> Module*
//   Module   -> IDENT "{" Assign* "}"
//   Assign   -> IDENT "=" ValueList ";"
//   ValueList-> VALUE ("," VALUE)*

export function tokenizeConfig(input) {
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    if ("{}=;,".includes(ch)) {
      tokens.push({ type: ch, value: ch });
      i += 1;
      continue;
    }

    if (/[\w\u4e00-\u9fa5.-]/.test(ch)) {
      let value = "";
      while (i < input.length && /[\w\u4e00-\u9fa5.-]/.test(input[i])) {
        value += input[i];
        i += 1;
      }
      tokens.push({ type: "IDENT", value });
      continue;
    }

    throw new Error(`无法识别的字符：${ch}`);
  }

  return tokens;
}

export function parseConfig(input) {
  const tokens = tokenizeConfig(input);
  let pos = 0;

  const peek = () => tokens[pos];
  const consume = (type) => {
    const token = tokens[pos];
    if (!token || token.type !== type) {
      throw new Error(`配置语法错误：期望 ${type}，实际 ${token?.type || "EOF"}`);
    }
    pos += 1;
    return token;
  };

  const config = {};

  while (pos < tokens.length) {
    const moduleName = consume("IDENT").value;
    consume("{");
    config[moduleName] = {};

    while (peek() && peek().type !== "}") {
      const key = consume("IDENT").value;
      consume("=");

      const values = [consume("IDENT").value];
      while (peek() && peek().type === ",") {
        consume(",");
        values.push(consume("IDENT").value);
      }

      consume(";");
      config[moduleName][key] = values.length === 1 ? normalizeValue(values[0]) : values.map(normalizeValue);
    }

    consume("}");
  }

  return config;
}

function normalizeValue(value) {
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}
