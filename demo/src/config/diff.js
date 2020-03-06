/* eslint-disable */
import { rTabs } from "utils";

const examples = {
  original: rTabs(`
  <!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"UTF-8\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\" />\r\n    <title>Document</title>\r\n  </head>\r\n  <body>\r\n    <div id=\"root\">not rendered</div>\r\n    <script src=\"https://unpkg.com/react@16.4.1/umd/react.development.js\"></script>\r\n    <script src=\"https://unpkg.com/react-dom@16.4.1/umd/react-dom.development.js\"></script>\r\n  </body>\r\n</html>\r\n
  `),
  modified: rTabs(`
  <!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"UTF-8\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n    <title>Document</title>\r\n  </head>\r\n  <body></body>\r\n</html>\r\n
  `),
  modified2: rTabs(`
    import React from "react";
    import ReactDOM from "react-dom";

    import Editor from '@monaco-editor/react';

    const App = _ => <Editor height="90vh" language="javascript" />;

    const rootElement = document.getElementById("root");
    ReactDOM.render(<App />, rootElement);
    \`\`\`

    <details><summary>Extended example</summary>

    \`\`\`js
    import React, { useState } from "react";
    import ReactDOM from "react-dom";

    import Editor from "@monaco-editor/react";
    import { FillSpinner as Loader } from "react-spinners-kit";

    import examples from "./examples";

    function App() {
      const [theme, setTheme] = useState("light");
      const [language, setLanguage] = useState("javascript");
      const [isEditorReady, setIsEditorReady] = useState(false);

      function handleEditorDidMount() {
        setIsEditorReady(true);
      }

      function toggleTheme() {
        setTheme(theme === 'light' ? 'dark' : 'light');
        setTheme(theme === "light" ? "light" : "light");
      }

      function toggleLanguage() {
        setLanguage(language === "javascript" ? "python" : "javascript");
      }

      return (
        <>
          <button onClick={toggleTheme} disabled={!isEditorReady}>
            Toggle theme
          </button>
          <button onClick={toggleLanguage} disabled={!isEditorReady}>
            Toggle language
          </button>

          <Editor
            height="90vh" // By default, it fully fits with its parent
            theme={theme}
            language={language}
            loading={<Loader />}
            value={examples[language]}
            editorDidMount={handleEditorDidMount}
            options={{ lineNumbers: "off" }}
          />
        </>
      );
    }

    const rootElement = document.getElementById("root");
    ReactDOM.render(<App />, rootElement);
    \`\`\`

    You can play with it [here](https://codesandbox.io/s/monaco-editor-react-u0fyv?fontsize=14)

    </details>

    #### Get Value

    You may ask how we can get the value of the editor. There is a prop called \`editorDidMount\`. It gets two arguments: the first one is a function to get editor value, the second one is the editor instance.
    Here is an example of how you can implement it.
    You can play with it [here](https://codesandbox.io/s/example-for-issue-2-1hzz8?fontsize=14)

    \`\`\`js
    import React, { useRef, useState } from "react";
    import ReactDOM from "react-dom";

    import Editor from "@monaco-editor/react";

    function App() {
      const [isEditorReady, setIsEditorReady] = useState(false);
      const valueGetter = useRef();

      function handleEditorDidMount(_valueGetter) {
        setIsEditorReady(true);
        valueGetter.current = _valueGetter;
      }

      function handleShowValue() {
        alert(valueGetter.current());
      }

      return (
        <>
          <button onClick={handleShowValue} disabled={!isEditorReady}>
            Show value
          </button>

          <Editor
            height="90vh"
            language="javascript"
            value={"// write your code here"}
            editorDidMount={handleEditorDidMount}
          />
        </>
      );
    }

    const rootElement = document.getElementById("root");
    ReactDOM.render(<App />, rootElement);
    \`\`\`

    #### Monaco Instance
    If you want to create your own language or theme, or modify existing ones you may need to access to the monaco instance. So, to that purpose, there is a utility called "monaco" exported from library and you can use it like this:

    \`\`\`js
    import { monaco } from '@monaco-editor/react';

    monaco
      .init()
      .then(monaco => /* here is the instance of monaco, so you can use the \`monaco.languages\` or whatever you want */)
      .catch(error => console.error('An error occurred during initialization of Monaco: ', error));
    \`\`\`

    #### Editor Instance

    It's handy to have access to the editor instance for some reason.

    As we have already mentioned, the \`editorDidMount\` prop gets the editor instance as a second argument.
    Here is an example of how you can use the editor instance.
    You can play with it [here](https://codesandbox.io/s/monaco-editorreact---editor-instance-zgh90)

    \`\`\`js
    import React, { useRef } from "react";
    import ReactDOM from "react-dom";

    import Editor from "@monaco-editor/react";

    function App() {
      const editorRef = useRef();

      function handleEditorDidMount(_, editor) {
        editorRef.current = editor;
        // Now you can use the instance of monaco editor
        // in this component whenever you want
      }

      function listenEditorChagnes() {
        editorRef.current.onDidChangeModelContent(ev => {
          console.log(editorRef.current.getValue());
        });
      }

      return (
        <>
          <button onClick={listenEditorChagnes} disabled={!!editorRef.current}>
            Press to listen editor changes (see console)
          </button>
          <Editor
            height="90vh"
            editorDidMount={handleEditorDidMount}
            language="javascript"
          />
        </>
      );
    }

    const rootElement = document.getElementById("root");
    ReactDOM.render(<App />, rootElement);
    \`\`\`

    #### Controlled Editor

    The default export of the library is uncontrolled react component:

    \`\`\`import Editor from '@monaco-editor/react' \`\`\`

    We make it by default uncontrolled to keep the nature of the monaco editor as much as it is possible. And based on our experience we can say that in most cases it will cover your needs, as you can see in the examples above. And we highly recommend using that one.

    But in any case, if you want a controlled one, there is an option for that. The library exports \`ControlledEditor\` (as named export). It is the same as the default one (\`Editor\`), plus it has \`onChange\` method. It is working a little bit different comparing with, for example, the controlled \`input\` field.

    Here is \`onChange\` prop, it will be called each time when the content of the editor is changed. It gets two arguments, first one is the "event" object of monaco, the second one is the current value of the editor.

    You can use it without circulating the data, and just by returning it from \`onChange\` simple setting the new value; see the example (You can play with it [here](https://codesandbox.io/s/monaco-editorreact---controlled-editor-2-7iqpv?fontsize=14))

    \`\`\`js
    import React from "react";
    import ReactDOM from "react-dom";

    import { ControlledEditor } from "@monaco-editor/react";

    const BAD_WORD = "eval";
    const WORNING_MESSAGE = " <- hey man, what's this?";

    function App() {
      const handleEditorChange = (ev, value) => {
        return value.includes(BAD_WORD) && !value.includes(WORNING_MESSAGE)
          ? value.replace(BAD_WORD, BAD_WORD + WORNING_MESSAGE)
          : value.includes(WORNING_MESSAGE) && !value.includes(BAD_WORD)
            ? value.replace(WORNING_MESSAGE, "")
            : value;
      };

      return (
        <ControlledEditor
          height="90vh"
          value={"// try to write e%v%a%l somewere 😈 \n"}
          onChange={handleEditorChange}
          language="javascript"
        />
      );
    }

    const rootElement = document.getElementById("root");
    ReactDOM.render(<App />, rootElement);
    \`\`\`

    Or like in usual controlled components; see the example (You can play with it [here](https://codesandbox.io/s/monaco-editorreact---controlled-editor-yg5il?fontsize=14))

    \`\`\`js
    import React, { useState } from "react";
    import ReactDOM from "react-dom";

    import { ControlledEditor } from "@monaco-editor/react";

    const BAD_WORD = "eval";
    const WORNING_MESSAGE = " <- hey man, what's this?";

    function App() {
      const [value, setValue] = useState("// try to write e%v%a%l somewere 😈 \n");

      const handleEditorChange = (ev, value) => {
        setValue(
          value.includes(BAD_WORD) && !value.includes(WORNING_MESSAGE)
            ? value.replace(BAD_WORD, BAD_WORD + WORNING_MESSAGE)
            : value.includes(WORNING_MESSAGE) && !value.includes(BAD_WORD)
              ? value.replace(WORNING_MESSAGE, "")
              : value
        );
      };

      return (
        <ControlledEditor
          height="90vh"
          value={value}
          onChange={handleEditorChange}
          language="javascript"
        />
      );
    }

    const rootElement = document.getElementById("root");
    ReactDOM.render(<App />, rootElement);
    \`\`\`

    <details><summary>Another example</summary>

    \`\`\`js
    import React from "react";
    import ReactDOM from "react-dom";

    import { ControlledEditor } from "@monaco-editor/react";

    function App() {
      const handleEditorChange = (ev, value) => {
        return \`"it dosn't matter what you are writing, I am staying here!!!"\`;
      };

      return (
        <ControlledEditor
          height="90vh"
          onChange={handleEditorChange}
          language="javascript"
        />
      );
    }

    const rootElement = document.getElementById("root");
    ReactDOM.render(<App />, rootElement);
    \`\`\`

    You can play with it [here](https://codesandbox.io/s/monaco-editorreact---controlled-editor-3-h0uro?fontsize=14)

    </details>

    ## Props

    #### Editor

    | Name   |      Type      |  Default |  Description |
    |:----------|:-------------|:------|:------|
    | value | string || The editor value |
    | language | enum: ... | | All languages that are [supported](https://github.com/microsoft/monaco-languages) by monaco-editor |
    | editorDidMount | func | noop | **Signature: function(getEditorValue: func, monaco: object) => void** <br/> This function will be called right after monaco editor is mounted and is ready to work. It will get the editor instance as a second argument |
    | theme | enum: 'light' \| 'dark' | 'light' | Default themes of monaco |
    | line | number |  | The line to jump on it |
    | width | union: number \| string | '100%' | The width of the editor wrapper |
    | height | union: number \| string | '100%' | The height of the editor wrapper |
    | loading | union: React element \| string | 'Loading...' | The loading screen before the editor is loaded |
    | options | object | {} | [IEditorOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html) |

    #### DiffEditor

    | Name   |      Type      |  Default |  Description |
    |:----------|:-------------|:------|:------|
    | original | string || The original source (left one) value |
    | modified | string || The modified source (right one) value |
    | language | enum: ... | | All languages that are [supported](https://github.com/microsoft/monaco-languages) by monaco-editor |
    | originalLanguage | enum: ... | *language | This prop gives you the opportunity to specify the language of the \`original\` source separately, otherwise, it will get the value of \`language\` property. (Possible values are the same as \`language\`) |
    | modifiedLanguage | enum: ... | *language | This prop gives you the opportunity to specify the language of the \`modified\` source separately, otherwise, it will get the value of \`language\` property. (Possible values are the same as \`language\`) |
    | editorDidMount | func | noop | **Signature: function(getOriginalEditorValue: func, getModifiedEditorValue: func, monaco: object) => void** <br/> This function will be called right after monaco editor is mounted and is ready to work. It will get the editor instance as a third argument |
    | theme | enum: 'light' \| 'dark' | 'light' | Default themes of monaco |
    | line | number |  | The line to jump on it |
    | width | union: number \| string | '100%' | The width of the editor wrapper |
    | height | union: number \| string | '100%' | The height of the editor wrapper |
    | loading | union: React element \| string | 'Loading...' | The loading screen before the editor is loaded |
    | options | object | {} | [IDiffEditorOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.idiffeditorconstructionoptions.html) |

    #### Controlled Editor

    Extended from Editor (the same props as in Editor plus onChange introduced below)

    | Name   |      Type      |  Default |  Description |
    |:----------|:-------------|:------|:------|
    | onChange | func | noop | **Signature: function(ev: any, value: string \| undefined) => string \| undefined** onChange method of monaco editor. It will be called right after the content of the current model is changed. It gets two arguments: first one is the "event" object of monaco, second one is the current value. NOTE: onChange can return the new value, which will be inserted to editor |

    ## License

    [MIT](./LICENSE)
  `)
};

export default examples;
