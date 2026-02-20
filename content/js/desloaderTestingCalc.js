var url = null

const editor = ace.edit('editor')
editor.setTheme('ace/theme/dracula')

function getEditorCode() {
    return editor.getValue()
}

UVs = null;
UVmap = [];
rbgValues = [];
C = [];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function buttonclick() {
    Calc.setBlank();
    try {
        let state = await Calc.getState();
        let text = await getEditorCode()
        let tokens = await tokenizer(text);
        let processedTokens = await tokenProcessor(tokens);
        let AST = await tokentoAST(processedTokens)
        ASTToDesmos(AST, state)
    } catch (e) {
        console.log(e)
        alert(e)
    }
}


function tokenizer(input) {
    const tokens = [];
    const regex = /\s*([A-Za-z_]\w*|\d+|".*?"|[-+*/=^<>(){},.;|#\[\]])\s*/g;
    let match;

    while ((match = regex.exec(input)) !== null) {
        const value = match[1];
        let type;

        if (/^\d+$/.test(value)) {
            type = "NUMBER";
        } else if (["+", "-", "*", "/", "=", "^", "<", ">", "|"].includes(value)) {
            type = "OPERATOR";
        } else if (["(", ")", "{", "}", ";", "[", "]", ",", "."].includes(value)) {
            type = "PUNCTUATION";
        } else if (["if", "var", "function", "else", "ticker", "Math", "folder", "return"].includes(value)) {
            type = "KEYWORD";
        } else if (["random", "round", "sign", "polygon", "max", "min", "mod", "with", "sin", "cos", "tan", "csc", "sec", "cot", "mean", "meadian", "quartile", "shuffle", "midpoint", "floor", "ceil", "distance", "count", "total", "mad", "stats", "estimate", "dt", "median", "height", "width", "times", "hsv", "rgb", "sort"].includes(value)) {
            type = "OPERATOR REPLACEMENT";
        } else if (["number", "array", "vector"].includes(value)) {
            type = "VARABLE IDENTIFIER";
        } else {
            type = "IDENTIFIER";
        }
        tokens.push({ type, value });
    }

    return tokens;
}


function tokenProcessor(input) {
    let lastWasLeft = false;
    for (let i = 0; i < input.length; i++) {
        if (input[i].type == "OPERATOR") {
            if (input[i].value == "*" && input[i - 1].value != "/" && input[i + 1].value != "/") {
                input[i].value = " \\cdot "
            } else if (input[i].value == "|" & lastWasLeft == false) {
                input[i].value = " \\left|"
                lastWasLeft = true;
            } else if (input[i].value == "|" & lastWasLeft == true) {
                input[i].value = " \\right|"
                lastWasLeft = false;
            }
        }
        if (i >= 2) {
            if (input[i - 1].type == "PUNCTUATION" && input[i - 1].value == "." && input[i - 2].type == "KEYWORD" && input[i - 2].value == "Math") {
                if (input[i].type == "OPERATOR REPLACEMENT") {
                    if (input[i].value == "random") {
                        input[i].value = " \\operatorname{random}"
                    } else if (input[i].value == "round") {
                        input[i].value = " \\operatorname{round}"
                    } else if (input[i].value == "sign") {
                        input[i].value = " \\operatorname{sign}"
                    } else if (input[i].value == "polygon") {
                        input[i].value = " \\operatorname{polygon}"
                    } else if (input[i].value == "max") {
                        input[i].value = " \\max"
                    } else if (input[i].value == "min") {
                        input[i].value = " \\min"
                    } else if (input[i].value == "mod") {
                        input[i].value = " \\operatorname{mod}"
                    } else if (input[i].value == "with") {
                        input[i].value = " \\operatorname{with}"
                    } else if (input[i].value == "sin") {
                        input[i].value = " \\sin"
                    } else if (input[i].value == "cos") {
                        input[i].value = " \\cos"
                    } else if (input[i].value == "tan") {
                        input[i].value = " \\tan"
                    } else if (input[i].value == "csc") {
                        input[i].value = " \\csc"
                    } else if (input[i].value == "sec") {
                        input[i].value = " \\sec"
                    } else if (input[i].value == "cot") {
                        input[i].value = " \\cot"
                    } else if (input[i].value == "mean") {
                        input[i].value = " \\operatorname{mean}"
                    } else if (input[i].value == "meadian") {
                        input[i].value = " \\operatorname{meadian}"
                    } else if (input[i].value == "quartile") {
                        input[i].value = " \\operatorname{quartile}"
                    } else if (input[i].value == "shuffle") {
                        input[i].value = " \\operatorname{shuffle}"
                    } else if (input[i].value == "midpoint") {
                        input[i].value = " \\operatorname{midpoint}"
                    } else if (input[i].value == "floor") {
                        input[i].value = " \\operatorname{floor}"
                    } else if (input[i].value == "ceil") {
                        input[i].value = " \\operatorname{ceil}"
                    } else if (input[i].value == "distance") {
                        input[i].value = " \\operatorname{distance}"
                    } else if (input[i].value == "count") {
                        input[i].value = " \\operatorname{count}"
                    } else if (input[i].value == "total") {
                        input[i].value = " \\operatorname{total}"
                    } else if (input[i].value == "mad") {
                        input[i].value = " \\operatorname{mad}"
                    } else if (input[i].value == "stats") {
                        input[i].value = " \\operatorname{stats}"
                    } else if (input[i].value == "estimate") {
                        input[i].value = " \\operatorname{estimate}"
                    } else if (input[i].value == "dt") {
                        input[i].value = " \\operatorname{dt}"
                    } else if (input[i].value == "median") {
                        input[i].value = " \\operatorname{median}"
                    } else if (input[i].value == "height") {
                        input[i].value = " \\operatorname{height}"
                    } else if (input[i].value == "width") {
                        input[i].value = " \\operatorname{width}"
                    } else if (input[i].value == "times") {
                        input[i].value = " \\times"
                    } else if (input[i].value == "hsv") {
                        input[i].value = " \\operatorname{hsv}"
                    } else if (input[i].value == "rgb") {
                        input[i].value = " \\operatorname{rgb}"
                    } else if (input[i].value == "sort") {
                        input[i].value = " \\operatorname{sort}"
                    }
                    // TODO add more functions here
                    input.splice(i - 2, 2)
                }
            } else if (["random", "round", "sign", "polygon", "max", "min", "mod", "with", "sin", "cos", "tan", "csc", "sec", "cot", "mean", "meadian", "quartile", "shuffle", "midpoint", "floor", "ceil", "distance", "count", "total", "mad", "stats", "estimate", "dt", "median"].includes(input[i].value)) {
                input[i].type = "IDENTIFIER"
            }
        }
    }
    return input;
}

function tokentoAST(input) {
    const AST = []
    for (let i = 0; i < input.length; i++) {
        // Variable stuff
        alert(input[i].value)
        if (input[i].type == "KEYWORD" && input[i].value == "var") {
            i = CreateVariable(AST, input, i)
        }

        if (input[i].value == "/" && input[i+1].value == "*") {
            alert("Called")
            i = CreateComment(AST, input, i)
        }
        // Function stuff
        if (input[i].type == "KEYWORD" && input[i].value == "function") {
            i = CreateFunction(AST, input, i)
        }
        // Folder stuff
        if (input[i].type == "KEYWORD" && input[i].value == "folder") {
            i = CreateFolder(AST, input, i)
        }
        // TICKER STUFF--------------------------------------------------------------------------------
        if (input[i].type == "KEYWORD" && input[i].value == "ticker") {
            args = []
            data = {
                type: "Ticker",
                time: "",
                body: []
            };
            i += 2
            while (input[i].value != ")") {
                if (input[i].value !== ",") {
                    if (input[i].value.length > 1 && input[i].type == "IDENTIFIER") {
                        arg = input[i].value.slice(0, 1) + "_{" + input[i].value.slice(1) + "}"
                    } else {
                        arg = input[i].value
                    }
                    args.push(arg)
                }
                i++;
            }
            data.time = args
            while (input[i].value != "}") {
                if (input[i].type == "IDENTIFIER" && input[i + 1].value == "=") {
                    AssignmentExpression(data, input, i)
                } else if (input[i].type == "IDENTIFIER" && input[i + 1].value == "(") {
                    CallExpression(data, input, i)
                } else if (input[i].type == "KEYWORD" && input[i].value == "if") {
                    i = IfStatement(data, input, i)
                } else if (input[i].type == "KEYWORD" && input[i].value == "else" && input[i + 1].value == "if") {
                    i = ElseIfStatement(data, input, i)
                } else if (input[i].type == "KEYWORD" && input[i].value == "else" && input[i + 1].value !== "if") {
                    i = ElseStatement(data, input, i)
                }
                i++
            }
            AST.push(data)
        }
    }
    // Dev Stuff
    /*
    const blob = new Blob([JSON.stringify(AST)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Testdescode.json";
    a.click();
    URL.revokeObjectURL(a.href);
    */
    return AST
}

function CreateComment(FuncJson, input, i) {
    let text = []
    let data = {
        type: "Comment",
        CommentText: null,
    };
    i = i + 2
    while (input[i].value != "*" && input[i + 1].value != "/") {
        text += input[i].value + " ";
        i++;
    }
    data.CommentText = text
    if (FuncJson.body === undefined) {
        FuncJson.push(data)
    } else {
        FuncJson.body.push(data)
    }
    return i
}

function CreateFolder(FuncJson, input, i) {
    let data = {
        type: "FolderDeclaration",
        FolderName: input[i + 1].value,
        body: []
    };
    i += 2
    while (input[i].value != "}") {
        if (input[i].value == "/" && input[i + 1].value == "*") {
            i = CreateComment(data, input, i)
        } else if (input[i].type == "KEYWORD" && input[i].value == "var") {
            i = CreateVariable(data, input, i)
        } else if (input[i].type == "KEYWORD" && input[i].value == "function") {
            i = CreateFunction(data, input, i)
        } else if (input[i].type == "IDENTIFIER" && input[i + 1].value == "=") {
            AssignmentExpression(data, input, i)
        } else if (input[i].type == "IDENTIFIER" && input[i + 1].value == "(") {
            CallExpression(data, input, i)
        } else if (input[i].type == "KEYWORD" && input[i].value == "if") {
            i = IfStatement(data, input, i)
        } else if (input[i].type == "KEYWORD" && input[i].value == "else" && input[i + 1].value == "if") {
            i = ElseIfStatement(data, input, i)
        } else if (input[i].type == "KEYWORD" && input[i].value == "else" && input[i + 1].value !== "if") {
            i = ElseStatement(data, input, i)
        }
        i++
    }
    FuncJson.push(data)
    return i
}

function CreateFunction(FuncJson, input, i) {
    let args = []
    let data = {
        type: "FunctionDeclaration",
        FuncName: input[i + 1].value,
        arguments: "",
        body: []
    };
    i += 3
    while (input[i].value != ")") {
        if (input[i].value !== ",") {
            if (input[i].value.length > 1) {
                arg = input[i].value.slice(0, 1) + "_{" + input[i].value.slice(1) + "}"
            } else {
                arg = input[i].value
            }
            args.push(arg)
        }
        i++;
    }
    data.arguments = args
    while (input[i].value != "}") {
        if (input[i].type == "IDENTIFIER" && input[i + 1].value == "=") {
            AssignmentExpression(data, input, i)
        } else if (input[i].type == "IDENTIFIER" && input[i + 1].value == "(") {
            CallExpression(data, input, i)
        } else if (input[i].type == "KEYWORD" && input[i].value == "if") {
            i = IfStatement(data, input, i)
        } else if (input[i].type == "KEYWORD" && input[i].value == "else" && input[i + 1].value == "if") {
            i = ElseIfStatement(data, input, i)
        } else if (input[i].type == "KEYWORD" && input[i].value == "else" && input[i + 1].value !== "if") {
            i = ElseStatement(data, input, i)
        } else if (input[i].type == "KEYWORD" && input[i].value == "return") {
            i = FuncExpression(data, input, i)
        }
        i++
    }
    if (FuncJson.body === undefined) {
        FuncJson.push(data)
    } else {
        FuncJson.body.push(data)
    }
    return i;
}


function CreateVariable(FuncJson, input, i) {
    if (input[i + 1].value.length > 1) {
        identifer = input[i + 1].value.slice(0, 1) + "_{" + input[i + 1].value.slice(1) + "}"
    } else {
        identifer = input[i + 1].value
    }
    let value = ""
    i += 3
    while (input[i].value != ";") {
        if (input[i].type == "IDENTIFIER" && input[i].value.length > 1) {
            value += input[i].value.slice(0, 1) + "_{" + input[i].value.slice(1) + "}"
        } else {
            value += input[i].value
        }
        i++
    }
    let data = {
        type: "VariableDeclarator",
        identifer: identifer,
        value: value
    };

    if (FuncJson.body === undefined) {
        FuncJson.push(data)
    } else {
        FuncJson.body.push(data)
    }
    return i
}

function AssignmentExpression(FuncJson, input, number) {
    if (input[number].value.length > 1) {
        identifer = input[number].value.slice(0, 1) + "_{" + input[number].value.slice(1) + "}"
    } else {
        identifer = input[number].value
    }
    let dat = {
        type: "ExpressionStatement",
        Expression: {
            type: "AssignmentExpression",
            identifier: identifer,
            body: []
        }
    }
    let Expression = []
    let W = number + 2
    while (input[W].value != ";") {
        if (input[W].type == "IDENTIFIER" || input[W].value == ".") {
            if (input[W].value.length > 1) {
                identifer = input[W].value.slice(0, 1) + "_{" + input[W].value.slice(1) + "}"
            } else {
                identifer = input[W].value
            }
            Expression.push(identifer)
        } else {
            Expression.push(input[W].value)
        }
        W++;
    }
    dat.Expression.body.push(Expression)
    if (FuncJson.body === undefined) {
        FuncJson.Expression.body.push(dat)
    } else {
        FuncJson.body.push(dat)
    }
}

function FuncExpression(FuncJson, input, number) {
    let dat = {
        type: "ExpressionStatement",
        Expression: {
            type: "FuncExpression",
            identifier: null,
            body: []
        }
    }
    let Expression = []
    let W = number + 1
    while (input[W].value != ";") {
        if (input[W].type == "IDENTIFIER") {
            if (input[W].value.length > 1) {
                identifer = input[W].value.slice(0, 1) + "_{" + input[W].value.slice(1) + "}"
            } else {
                identifer = input[W].value
            }
            Expression.push(identifer)
        } else {
            Expression.push(input[W].value)
        }
        W++;
    }
    dat.Expression.body.push(Expression)
    if (FuncJson.body === undefined) {
        FuncJson.Expression.body.push(dat)
    } else {
        FuncJson.body.push(dat)
    }
    return W
}

function CallExpression(FuncJson, input, number) {
    if (input[number].value.length > 1) {
        identifer = input[number].value.slice(0, 1) + "_{" + input[number].value.slice(1) + "}"
    } else {
        identifer = input[number].value
    }
    let args = []
    let W = number + 2
    while (input[W].value != ")") {
        if (input[W].value !== ",") {
            if (input[W].value.length > 1) {
                arg = input[W].value.slice(0, 1) + "_{" + input[W].value.slice(1) + "}"
            } else {
                arg = input[W].value
            }
            args.push(arg)
        }
        W++;
    }
    let dat = {
        type: "ExpressionStatement",
        Expression: {
            type: "CallExpression",
            identifier: identifer,
            args: args
        }
    }
    if (FuncJson.body === undefined) {
        FuncJson.Expression.body.push(dat)
    } else {
        FuncJson.body.push(dat)
    }
}

function IfStatement(FuncJson, input, number) {
    let args = []
    let W = number + 2
    while (input[W].value != ")") {
        if (input[W].value !== ",") {
            if (input[W].value.length > 1 && input[W].type == "IDENTIFIER") {
                arg = input[W].value.slice(0, 1) + "_{" + input[W].value.slice(1) + "}"
            } else {
                arg = input[W].value
            }
            args.push(arg)
        }
        W++
    }
    let dato = {
        type: "IfStatement",
        Expression: {
            type: "IfStatement",
            test: args,
            body: []
        }
    }
    while (input[W].value != "}") {
        if (input[W].type == "IDENTIFIER" && input[W + 1].value == "=") {
            AssignmentExpression(dato, input, W)
        } else if (input[W].type == "IDENTIFIER" && input[W + 1].value == "(") {
            CallExpression(dato, input, W)
        } else if (input[W].type == "KEYWORD" && input[W].value == "if") {
            W = IfStatement(dato, input, W)
        } else if (input[W].type == "KEYWORD" && input[W].value == "else" && input[W + 1].value == "if") {
            W = ElseIfStatement(dato, input, W)
        } else if (input[W].type == "KEYWORD" && input[W].value == "else" && input[W + 1].value !== "if") {
            W = ElseStatement(dato, input, W)
        } else if (input[W].type == "KEYWORD" && input[W].value == "return") {
            W = FuncExpression(dato, input, W)
        }
        W++;
    }
    if (FuncJson.body === undefined) {
        FuncJson.Expression.body.push(dato)
    } else {
        FuncJson.body.push(dato)
    }
    return W
}

function ElseIfStatement(FuncJson, input, number) {
    let args = []
    let W = number + 3
    while (input[W].value != ")") {
        if (input[W].value !== ",") {
            if (input[W].value.length > 1 && input[W].type == "IDENTIFIER") {
                arg = input[W].value.slice(0, 1) + "_{" + input[W].value.slice(1) + "}"
            } else {
                arg = input[W].value
            }
            args.push(arg)
        }
        W++
    }
    let dato = {
        type: "ElseIfStatement",
        Expression: {
            type: "IfStatement",
            test: args,
            body: []
        }
    }
    while (input[W].value != "}") {
        if (input[W].type == "IDENTIFIER" && input[W + 1].value == "=") {
            AssignmentExpression(dato, input, W)
        } else if (input[W].type == "IDENTIFIER" && input[W + 1].value == "(") {
            CallExpression(dato, input, W)
        } else if (input[W].type == "KEYWORD" && input[W].value == "if") {
            W = IfStatement(dato, input, W)
        } else if (input[W].type == "KEYWORD" && input[W].value == "else" && input[W + 1].value == "if") {
            W = ElseIfStatement(dato, input, W)
        } else if (input[W].type == "KEYWORD" && input[W].value == "else" && input[W + 1].value !== "if") {
            W = ElseStatement(dato, input, W)
        } else if (input[W].type == "KEYWORD" && input[W].value == "return") {
            W = FuncExpression(dato, input, W)
        }
        W++;
    }
    if (FuncJson.body === undefined) {
        FuncJson.Expression.body.push(dato)
    } else {
        FuncJson.body.push(dato)
    }
    return W
}

function ElseStatement(FuncJson, input, number) {
    let args = []
    let dato = {
        type: "ElseStatement",
        Expression: {
            type: "IfStatement",
            test: args,
            body: []
        }
    }
    let A = number + 1
    while (input[A].value != "}") {
        if (input[A].type == "IDENTIFIER" && input[A + 1].value == "=") {
            AssignmentExpression(dato, input, A)
        } else if (input[A].type == "IDENTIFIER" && input[A + 1].value == "(") {
            CallExpression(dato, input, A)
        } else if (input[A].type == "KEYWORD" && input[A].value == "if") {
            A = IfStatement(dato, input, A)
        } else if (input[A].type == "KEYWORD" && input[A].value == "else" && input[A + 1].value == "if") {
            A = ElseIfStatement(dato, input, A)
        } else if (input[A].type == "KEYWORD" && input[A].value == "else" && input[A + 1].value !== "if") {
            A = ElseStatement(dato, input, A)
        } else if (input[A].type == "KEYWORD" && input[W].value == "return") {
            A = FuncExpression(dato, input, A)
        }
        A++;
    }
    if (FuncJson.body === undefined) {
        FuncJson.Expression.body.push(dato)
    } else {
        FuncJson.body.push(dato)
    }
    return A
}


function ASTToDesmos(AST, calcstate) {
    for (let i = 0; i < AST.length; i++) {
        // Variable stuff
        if (AST[i].type == "FolderDeclaration") {
            let folderId = getRandomInt(1, 10000);
            calcstate.expressions.list.push({
                type: "folder",
                id: folderId.toString(),
                title: AST[i].FolderName,
                collapsed: true
            })
            for (let e = 0; e < AST[i].body.length; e++) {
                if (AST[i].body[e].type == "VariableDeclarator") {
                    calcstate.expressions.list.push({
                        type: "expression",
                        folderId: folderId.toString(),
                        id: 1,
                        latex: AST[i].body[e].identifer + "=" + AST[i].body[e].value
                    });
                }
                if (AST[i].body[e].type == "Comment") {
                    calcstate.expressions.list.push({
                        type: "text",
                        folderId: folderId.toString(),
                        text: AST[i].body[e].CommentText
                    });
                }
                if (AST[i].body[e].type == "FunctionDeclaration") {
                    FunctionASTToDes(AST[i].body[e], folderId, calcstate)
                }
            }
        }
        if (AST[i].type == "Comment") {
            calcstate.expressions.list.push({
                type: "text",
                text: AST[i].CommentText
            });
        }
        if (AST[i].type == "VariableDeclarator") {
            calcstate.expressions.list.push({
                type: "expression",
                id: 1,
                latex: AST[i].identifer + "=" + AST[i].value
            });
        }
        // Function stuff
        if (AST[i].type == "FunctionDeclaration") {
            FunctionASTToDes(AST[i], null, calcstate)
        }
        // TICKER STUFF--------------------------------------------------------------------------------
        if (AST[i].type == "Ticker") {
            let body = ""
            for (let e = 0; e < AST[i].body.length; e++) {
                if (AST[i].body[e].Expression.type == "AssignmentExpression") {
                    body += AssignmentExpressionASTToDes(AST[i].body[e].Expression.identifier, AST[i].body[e].Expression.body[0].length, AST[i].body[e].Expression.body, e)
                }
                if (AST[i].body[e].Expression.type == "CallExpression") {
                    body += CallExpressionASTToDes(AST[i].body[e].Expression.identifier, AST[i].body[e].Expression.args, e)
                }
                if (AST[i].body[e].Expression.type == "IfStatement" && AST[i].body[e].type == "IfStatement") {
                    body += IfStatementASTtoDes(AST[i].body[e].Expression.body, AST[i].body, e)
                }
                if (AST[i].body[e].Expression.type == "IfStatement" && AST[i].body[e].type == "ElseIfStatement") {
                    body += ElseIfStatementASTToDes(AST[i].body[e].Expression.body, AST[i].body, e)
                }
                if (AST[i].body[e].Expression.type == "IfStatement" && AST[i].body[e].type == "ElseStatement") {
                    body += ElseStatementASTToDes(AST[i].body[e].Expression.body, AST[i].body, e)
                }
            }
            calcstate.expressions.ticker = {
                handlerLatex: body,
                minStepLatex: AST[i].time.join(""),
                open: true
            };
        }
        Calc.setState(calcstate)
    }
}



function FunctionASTToDes(data, folderID, calcstate) {
    if (data.FuncName.length > 1) {
        FunctionName = data.FuncName.slice(0, 1) + "_{" + data.FuncName.slice(1) + "}"
    } else {
        FunctionName = data.FuncName
    }
    let body = ""
    for (let e = 0; e < data.body.length; e++) {
        if (data.body[e].Expression.type == "FuncExpression") {
            args += FuncExpressionASTToDes(ExpressionBody[e].Expression.body)
        }
        if (data.body[e].Expression.type == "AssignmentExpression") {
            body += AssignmentExpressionASTToDes(data.body[e].Expression.identifier, data.body[e].Expression.body[0].length, data.body[e].Expression.body, e)
        }
        if (data.body[e].Expression.type == "CallExpression") {
            body += CallExpressionASTToDes(data.body[e].Expression.identifier, data.body[e].Expression.args, e)
        }
        if (data.body[e].Expression.type == "IfStatement" && data.body[e].type == "IfStatement") {
            body += IfStatementASTtoDes(data.body[e].Expression.body, data.body, e)
        }
        if (data.body[e].Expression.type == "IfStatement" && data.body[e].type == "ElseIfStatement") {
            body += ElseIfStatementASTToDes(data.body[e].Expression.body, data.body, e)
        }
        if (data.body[e].Expression.type == "IfStatement" && data.body[e].type == "ElseStatement") {
            body += ElseStatementASTToDes(data.body[e].Expression.body, data.body, e)
        }
    }
    if (folderID == null) {
        calcstate.expressions.list.push({
            type: "expression",
            id: 1,
            latex: FunctionName + "(" + data.arguments + ")" + "=" + body
        });
    } else {
        calcstate.expressions.list.push({
            type: "expression",
            folderId: folderID.toString(),
            id: 1,
            latex: FunctionName + "(" + data.arguments + ")" + "=" + body
        });
    }
}

function CallExpressionASTToDes(identifier, args, e) {
    body = ""
    if (e == 0) {
        body = identifier + "(" + args + ")"
    } else {
        body += "," + identifier + "(" + args + ")"
    }
    return body
}

function AssignmentExpressionASTToDes(identifier, length, ExpressionBody, e) {
    body = ""
    if (e == 0) {
        body = identifier + "\\to "
    } else {
        body += "," + identifier + "\\to "
    }
    for (let W = 0; W < length; W++) {
        body += ExpressionBody[0][W]
    }
    return body
}

function IfStatementASTtoDes(ExpressionBody, ASTBody, e) {
    let args = ""
    for (let E = 0; E < ExpressionBody.length; E++) {
        if (ExpressionBody[E].Expression.type == "FuncExpression") {
            args += FuncExpressionASTToDes(ExpressionBody[E].Expression.body)
        }
        if (ExpressionBody[E].Expression.type == "AssignmentExpression") {
            args += AssignmentExpressionASTToDes(ExpressionBody[E].Expression.identifier, ExpressionBody[E].Expression.body[0].length, ExpressionBody[E].Expression.body, E)
        }
        if (ExpressionBody[E].Expression.type == "CallExpression") {
            args += CallExpressionASTToDes(ExpressionBody[E].Expression.identifier, ExpressionBody[E].Expression.args, E)
        }
        if (ExpressionBody[E].type == "IfStatement") {
            args += IfStatementASTtoDes(ExpressionBody[E].Expression.body, ASTBody[e].Expression.body, E)
        }
        if (ExpressionBody[E].type == "ElseIfStatement") {
            args += ElseIfStatementASTToDes(ExpressionBody[E].Expression.body, ASTBody[e].Expression.body, E)
        }
        if (ExpressionBody[E].type == "ElseStatement") {
            args += ElseStatementASTToDes(ExpressionBody[E].Expression.body, ASTBody[e].Expression.body, E)
        }
    }
    let body = ""
    if (ASTBody.length > e + 1) {
        if (e == 0 && ASTBody[e + 1].type !== "ElseIfStatement" && ASTBody[e + 1].type !== "ElseStatement") {
            body = "\\left\\{" + ASTBody[e].Expression.test.join("") + ":(" + args + ")\\right\\}"
        } else if (ASTBody[e + 1].type !== "ElseIfStatement" && ASTBody[e + 1].type !== "ElseStatement") {
            body += "," + "\\left\\{" + ASTBody[e].Expression.test.join("") + ":(" + args + ")\\right\\}"
        } else if (e == 0) {
            body = "\\left\\{" + ASTBody[e].Expression.test.join("") + ":(" + args + ")"
        } else {
            body += "," + "\\left\\{" + ASTBody[e].Expression.test.join("") + ":(" + args + ")"
        }
    } else {
        if (e == 0) {
            body = "\\left\\{" + ASTBody[e].Expression.test.join("") + ":(" + args + ")\\right\\}"
        } else {
            body += "," + ASTBody[e].Expression.test.join("") + ":(" + args + ")\\right\\}"
        }
    }
    return body
}

function ElseIfStatementASTToDes(ExpressionBody, ASTBody, e) {
    let args = ""
    for (let E = 0; E < ExpressionBody.length; E++) {
        if (ExpressionBody[E].Expression.type == "AssignmentExpression") {
            args += AssignmentExpressionASTToDes(ExpressionBody[E].Expression.identifier, ExpressionBody[E].Expression.body[0].length, ExpressionBody[E].Expression.body, E)
        }
        if (ExpressionBody[E].Expression.type == "FuncExpression") {
            args += FuncExpressionASTToDes(ExpressionBody[E].Expression.body)
        }
        if (ASTBody[E].Expression.type == "CallExpression") {
            args += CallExpressionASTToDes(ExpressionBody[E].Expression.identifier, ExpressionBody[E].Expression.args, E)
        }
        if (ExpressionBody[E].type == "IfStatement") {
            args += IfStatementASTtoDes(ExpressionBody[E].Expression.body, ASTBody[e].Expression.body, E)
        }
        if (ExpressionBody[E].type == "ElseIfStatement") {
            args += ElseIfStatementASTToDes(ExpressionBody[E].Expression.body, ASTBody[e].Expression.body, E)
        }
        if (ExpressionBody[E].type == "ElseStatement") {
            args += ElseStatementASTToDes(ExpressionBody[E].Expression.body, ASTBody[e].Expression.body, E)
        }
    }
    let body = ""
    if (ASTBody.length > e + 1) {
        if (ASTBody[e + 1].type !== "ElseIfStatement" && ASTBody[e + 1].type !== "ElseStatement") {
            body += "," + ASTBody[e].Expression.test.join("") + ":(" + args + ")\\right\\}"
        } else {
            body += "," + ASTBody[e].Expression.test.join("") + ":(" + args + ")"
        }
    } else {
        body += "," + ASTBody[e].Expression.test.join("") + ":(" + args + ")\\right\\}"
    }
    return body
}

function ElseStatementASTToDes(ExpressionBody, ASTBody, e) {
    let args = ""
    for (let E = 0; E < ExpressionBody.length; E++) {
        if (ExpressionBody[E].Expression.type == "AssignmentExpression") {
            args += AssignmentExpressionASTToDes(ExpressionBody[E].Expression.identifier, ExpressionBody[E].Expression.body[0].length, ExpressionBody[E].Expression.body, E)
        }
        if (ExpressionBody[E].Expression.type == "FuncExpression") {
            args += FuncExpressionASTToDes(ExpressionBody[E].Expression.body)
        }
        if (ASTBody[E].Expression.type == "CallExpression") {
            args += CallExpressionASTToDes(ExpressionBody[E].Expression.identifier, ExpressionBody[E].Expression.args, E)
        }
        if (ExpressionBody[E].type == "IfStatement") {
            args += IfStatementASTtoDes(ExpressionBody[E].Expression.body, ASTBody[e].Expression.body, E)
        }
        if (ExpressionBody[E].type == "ElseIfStatement") {
            args += ElseIfStatementASTToDes(ExpressionBody[E].Expression.body, ASTBody[e].Expression.body, E)
        }
        if (ExpressionBody[E].type == "ElseStatement") {
            args += ElseStatementASTToDes(ExpressionBody[E].Expression.body, ASTBody[e].Expression.body, E)
        }
    }
    let body = ""
    body += "," + args + "\\right\\}"
    return body
}

function FuncExpressionASTToDes(ExpressionBody) {
    let body = ""
    for (let W = 0; W < ExpressionBody[0].length; W++) {
        body += ExpressionBody[0][W]
    }
    return body
}



function CreateOBJStuff(OBJFile, PointName, FaceName, state, FileName) {
    return new Promise((resolve, reject) => {
        if (PointName.length > 1) {
            PointName = PointName.slice(0, 1) + "_{" + PointName.slice(1) + "}"
        }
        if (FaceName.length > 1) {
            FaceName = FaceName.slice(0, 1) + "_{" + FaceName.slice(1) + "}"
        }
        const reader = new FileReader();
        reader.onload = (OBJFile) => {
            const text = OBJFile.target.result;
            const lines = text.split('\n');
            const Vertexes = lines.filter(line => line.startsWith('v '));
            const UVs = lines.filter(line => line.startsWith('vt '));
            let UVS = []
            const Faces = lines.filter(line => line.startsWith('f'));
            let Output = []
            for (let i = 0; i < Vertexes.length; i++) {
                Vlines = []
                UVLine = Vertexes[i].substr(2)
                UVLine = UVLine.split(' ');
                Vlines.push("(" + UVLine[0], UVLine[1], UVLine[2] + ")")
                Vertexes[i] = Vlines
            }
            for (let i = 0; i < UVs.length; i++) {
                Vlines = []
                UVLine = UVs[i].substr(3)
                UVLine = UVLine.split(' ');
                Vlines.push(UVLine[0], 1 - UVLine[1])
                UVs[i] = Vlines
            }
            for (let i = 0; Faces.length > i; i++) {
                Fnlines = []
                Flines = []
                Fline = Faces[i].substr(2)
                Fline = Fline.split(' ');
                Fline1 = Fline[0].split('/');
                Fline2 = Fline[1].split('/');
                Fline3 = Fline[2].split('/');
                Flines.push("(" + parseInt(Fline1[0]) + "," + parseInt(Fline2[0]) + "," + parseInt(Fline3[0]) + ")")
                Fnlines.push(UVs[parseInt(Fline1[1]) - 1].map(Number), UVs[parseInt(Fline2[1]) - 1].map(Number), UVs[parseInt(Fline3[1]) - 1].map(Number))
                Faces[i] = Flines
                UVS[i] = Fnlines
            }
            Output[0] = Faces.join()
            Output[1] = Vertexes.join()
            let folder1Id = getRandomInt(1, 10000);
            state.expressions.list.push({
                type: "folder",
                id: folder1Id.toString(),
                title: FileName,
                collapsed: true
            });
            state.expressions.list.push({
                type: "expression",
                id: getRandomInt(1, 10000).toString(),
                folderId: folder1Id.toString(),
                color: "#c74440",
                latex: FaceName + "=[" + Output[0] + "]",
                hidden: true
            });
            state.expressions.list.push({
                type: "expression",
                id: getRandomInt(1, 10000).toString(),
                folderId: folder1Id.toString(),
                color: "#c74440",
                latex: PointName + "=[" + Output[1] + "]",
                hidden: true
            });
            Calc.setState(state)
            resolve(UVS);
        };
        reader.onerror = (e) => reject(e);
        reader.readAsText(OBJFile);
    });
}

function rgb2hsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, v = max;

    let diff = max - min;
    s = max === 0 ? 0 : diff / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / diff + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / diff + 2;
                break;
            case b:
                h = (r - g) / diff + 4;
                break;
        }
        h /= 6;
    }
    return "(" + Math.round(h * 360) + "," + Math.round(s * 100) + "," + Math.round(v * 100) + ")";
}

async function CreateHSVColorData(File, UVs, state, FileName, ColorName) {
    if (ColorName.length > 1) {
        ColorName = ColorName.slice(0, 1) + "_{" + ColorName.slice(1) + "}"
    }
    rbgValues = []
    const img = new Image();
    img.onload = async function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        Output = null;
        for (let i = 0; i < UVs.length; i++) {
            const triangle = UVs[i];
            const avgColor = await getAverageColorOfTriangle(ctx, triangle, img.width, img.height) + "";
            rbgValues[i] = avgColor
        }
        R = []
        G = []
        B = []
        for (let i = 0; i < rbgValues.length; i++) {
            R[i] = rbgValues[i].split(',')[0];
            G[i] = rbgValues[i].split(',')[1];
            B[i] = rbgValues[i].split(',')[2];
        }
        for (let i = 0; i < rbgValues.length; i++) {
            rbgValues[i] = rgb2hsv(R[i], G[i], B[i])
        }
        console.log(rbgValues)
        let folderId = getRandomInt(1, 10000);
        state.expressions.list.push({
            type: "folder",
            id: folderId.toString(),
            title: "Color Data of " + FileName,
            collapsed: true
        });
        state.expressions.list.push({
            type: "expression",
            id: getRandomInt(1, 10000).toString(),
            folderId: folderId.toString(),
            color: "#c74440",
            latex: ColorName + "=[" + rbgValues + "]",
            hidden: true
        });
        Calc.setState(state)
    }
    img.src = URL.createObjectURL(File);
}
