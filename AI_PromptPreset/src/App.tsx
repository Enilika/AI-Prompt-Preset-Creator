/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from "react";
import { Text, Textarea, Button, Box, Container, VStack, Select, Flex, Option, useAnimation } from "@yamada-ui/react";
import yaml from "js-yaml";

interface Template {
  name: string;
  content: string;
  fields: string[];
}

interface Inputs {
  [key: string]: string;
}

const templatesYaml = `
- name: BS2ビートシートの生成
  content: |
    あなたは優秀なストーリー原作者です
    以下のログラインに沿ったストーリーをBS2ビートシートに記述してください
    ・ログライン
    ＞ {ログライン}

    ・BS2ビートシート
      　オープニングイメージ

      　テーマの提示

      　セットアップ

      　きっかけ

      　悩みのとき

      　第一ターニングポイント

      　Bストーリー

      　お楽しみ

      　ミッドポイント

      　迫りくる悪いやつら

      　すべてを失って

      　心の暗闇

      　第二ターニングポイント

      　フィナーレ

      　ファイナルイメージ
      
  fields:
    - ログライン

- name: ストーリーラインについて
  content: |
    あなたは優秀な編集者です。
    以下のBS2ビートシートを確認して、修正案とその理由を提示してください。
    オープニングイメージ
    {オープニングイメージ}
    テーマの提示
    {テーマの提示}
    セットアップ
    {セットアップ}
    きっかけ
    {きっかけ}
    悩みのとき
    {悩みのとき}
    第一ターニングポイント
    {第一ターニングポイント}
    Bストーリー
    {Bストーリー}
    お楽しみ
    {お楽しみ}
    ミッドポイント
    {ミッドポイント}
    迫りくる悪いやつら
    {迫りくる悪いやつら}
    すべてを失って
    {すべてを失って}
    心の暗闇
    {心の暗闇}
    第二ターニングポイント
    {第二ターニングポイント}
    フィナーレ
    {フィナーレ}
    ファイナルイメージ
    {ファイナルイメージ}
  fields:
    - オープニングイメージ
    - テーマの提示
    - セットアップ
    - きっかけ
    - 悩みのとき
    - 第一ターニングポイント
    - Bストーリー
    - お楽しみ
    - ミッドポイント
    - 迫りくる悪いやつら
    - すべてを失って
    - 心の暗闇
    - 第二ターニングポイント
    - フィナーレ
    - ファイナルイメージ


- name: 歌詞を作る
  content: |
    あなたは優秀な作詞家です。
    以下の[テーマ]と[ジャンル]で[流れ]に沿って歌詞を作詞してください
    [テーマ]
    {テーマ}

    [ジャンル]
    {ジャンル}
    
    [流れ]
    ・イントロ
    ・1番Aメロ
    ・1番Bメロ
    ・1番サビ
    ・2番Aメロ
    ・2番Bメロ
    ・2番サビ
    ・Cメロ
    ・落ちサビ
    ・ラストサビ
    ・アウトロ
  fields:
    - テーマ
    - ジャンル

- name: 魅力的なキャラクター
  content: |
    あなたは優秀な作家です。
    以下のジャンルの物語の魅力的なキャラクターをフォーマットに沿って作成してください。
    {物語ジャンル}  
    [フォーマット]
    名前
    {名前}

    出身地

    身長
    
    体重

    見た目

    性格

    家族構成

    好きな食べ物

    背景ストーリー
    
  fields:
    - 物語ジャンル
    - 名前
`;

const AIPromptPresetPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [inputs, setInputs] = useState<Inputs>({});
  const [output, setOutput] = useState<string>("");

  const animation = useAnimation({
    keyframes: {
      "0%": {
        bg: "blue.500",
      },
      "20%": {
        bg: "sky.400",
      },
      "40%": {
        bg: "blue.300",
      },
      "60%": {
        bg: "sky.200",
      },
      "80%": {
        bg: "blue.300",
      },
      "100%": {
        bg: "sky.400",
      },
    },
    duration: "5s",
    iterationCount: "infinite",
    timingFunction: "linear",
  });

  useEffect(() => {
    try {
      const parsedTemplates = yaml.load(templatesYaml) as Template[];
      setTemplates(parsedTemplates);
      if (parsedTemplates.length > 0) {
        setSelectedTemplate(parsedTemplates[0]);
      }
    } catch (e) {
      console.error("Error parsing YAML:", e);
    }
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      let result = selectedTemplate.content;
      Object.entries(inputs).forEach(([key, value]) => {
        result = result.replace(`{${key}}`, value);
      });
      setOutput(result);
    }
  }, [selectedTemplate, inputs]);

  const handleInputChange = (key: string, value: string): void => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = (): void => {
    navigator.clipboard
      .writeText(output)
      .then(() => alert("Copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const handleTemplateChange = (value: string): void => {
    const template = templates.find((t) => t.name === value);
    if (template) {
      setSelectedTemplate(template);
      // Reset inputs when changing template
      setInputs({});
    }
  };

  const split_breakline = (value: string) => {
    return value?.split("\n").map((t, idx) => (
      <React.Fragment key={idx}>
        {t}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <Flex
      justify="center"
      align="center"
      minHeight="100vh"
      minWidth={"100vw"}
      // margin={"1vh 0.5vw 1vh 0.5vw"}
      borderRadius="sm"
      boxShadow="md"
      bgGradient="linear(45deg, hsla(270, 62%, 42%, 1) 0%, hsla(158, 94%, 49%, 1) 100%)"
    >
      <Container maxW="container.md" minWidth={"40vw"}>
        <VStack gap={8} width="100%" align="stretch" p={8} alignItems={"center"} justifyContent={"center"}>
          <Text fontSize="6xl" fontWeight="bold" textAlign="center" fontFamily={"Glass Antiqua"} color={"white"}>
            AI Prompt Preset Creator
          </Text>

          <Select
            value={selectedTemplate?.name || ""}
            onChange={(value) => handleTemplateChange(value)}
            placeholder="テンプレートを選択"
            placeholderInOptions={false}
            variant="flushed"
            size={"lg"}
            color={"blue.100"}
          >
            {templates.map((template, index) => (
              <Option key={index} value={template.name} color={"blue.800"}>
                {template.name}
              </Option>
            ))}
          </Select>

          <VStack gap={4} w="full">
            {selectedTemplate &&
              selectedTemplate.fields.map((field) => (
                <Textarea
                  key={field}
                  placeholder={field}
                  _placeholder={{ color: "white" }}
                  value={inputs[field] || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(field, e.target.value)}
                  border="1px"
                  boxShadow="md"
                  color={"blue.100"}
                />
              ))}
          </VStack>

          <Box w={"full"}>
            <Text fontSize="xl" fontWeight="bold" mb={2} color={"blue.100"}>
              プロンプト:
            </Text>
            <Box border="3px" borderRadius="md" p={4} minHeight="150px" boxShadow="md" color={"blue.100"}>
              {split_breakline(output)}
            </Box>
          </Box>

          <Button
            colorScheme={"sky"}
            color={"blue.100"}
            minWidth={"30vw"}
            minHeight={"8vh"}
            size="md"
            onClick={handleCopy}
            animation={animation}
          >
            コピー
          </Button>
        </VStack>
      </Container>
    </Flex>
  );
};

export default AIPromptPresetPage;
