'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

type Problem = {
  title: string
  description: string
  background: string
  solution: string
  beforeCode: string
  afterCode: string
  beforeDemo: React.ReactNode
  afterDemo: React.ReactNode
}

const problems: Problem[] = [
  {
    title: "フロートの崩れ (Float Collapse)",
    description: "フロート要素を含む親要素の高さが正しく計算されない問題です。",
    background: "フロートは元々テキストの回り込みのために設計されましたが、レイアウトにも使用されるようになりました。",
    solution: "クリアフィックス技法を使用するか、FlexboxやGridなど現代的なレイアウト技術を使用します。",
    beforeCode: `
.float-container {
  border: 2px solid #333;
  padding: 10px;
  background-color: #f0f0f0;
}

.float-item {
  float: left;
  width: 100px;
  height: 100px;
  margin: 10px;
}

.blue { background-color: #3498db; }
.green { background-color: #2ecc71; }
.red { background-color: #e74c3c; }
`,
    afterCode: `
.float-container {
  border: 2px solid #333;
  padding: 10px;
  background-color: #f0f0f0;
}

.float-container::after {
  content: "";
  display: table;
  clear: both;
}

.float-item {
  float: left;
  width: 100px;
  height: 100px;
  margin: 10px;
}

.blue { background-color: #3498db; }
.green { background-color: #2ecc71; }
.red { background-color: #e74c3c; }
`,
    beforeDemo: (
      <div className="space-y-4">
        <div className="border-2 border-gray-300 p-2 bg-gray-100">
          <div className="w-24 h-24 bg-blue-500 float-left m-2"></div>
          <div className="w-24 h-24 bg-green-500 float-left m-2"></div>
          <div className="w-24 h-24 bg-red-500 float-left m-2"></div>
          <p className="text-sm mt-2">この文章はフロート要素の後に配置されています。親要素の高さが正しく計算されていないため、背景色がフロート要素を覆っていません。</p>
        </div>
        <div className="border-2 border-gray-300 p-2">
          <p className="text-sm">この要素は前の要素の直後にありますが、フロートの崩れにより正しく配置されていません。</p>
        </div>
      </div>
    ),
    afterDemo: (
      <div className="space-y-4">
        <div className="border-2 border-gray-300 p-2 bg-gray-100 clearfix">
          <div className="w-24 h-24 bg-blue-500 float-left m-2"></div>
          <div className="w-24 h-24 bg-green-500 float-left m-2"></div>
          <div className="w-24 h-24 bg-red-500 float-left m-2"></div>
          <p className="text-sm mt-2">この文章はフロート要素の後に配置されています。clearfixを使用しているため、親要素の高さが正しく計算され、背景色がフロート要素を覆っています。</p>
        </div>
        <div className="border-2 border-gray-300 p-2">
          <p className="text-sm">この要素は前の要素の直後にあり、フロートの崩れが解消されたため正しく配置されています。</p>
        </div>
      </div>
    )
  },
  {
    title: "z-index の予期せぬ動作",
    description: "z-indexの値が期待通りに機能しない問題です。",
    background: "z-indexはスタッキングコンテキストという概念に基づいて動作します。",
    solution: "スタッキングコンテキストの仕組みを理解し、position: staticの要素にはz-indexが効かないことを認識します。",
    beforeCode: `
.stacking-context {
  position: relative;
}

.box {
  position: absolute;
  width: 100px;
  height: 100px;
}

.box1 { background: red; z-index: 2; }
.box2 { background: blue; z-index: 1; }
.box3 { background: green; }
    `,
    afterCode: `
.stacking-context {
  position: relative;
}

.box {
  position: absolute;
  width: 100px;
  height: 100px;
}

.box1 { background: red; z-index: 2; }
.box2 { background: blue; z-index: 1; }
.box3 { background: green; z-index: 3; }
    `,
    beforeDemo: (
      <div className="relative h-48 border-2 border-gray-300 p-2">
        <div className="absolute w-32 h-32 bg-red-500 left-4 top-4 z-20 flex items-center justify-center text-white">z-index: 2</div>
        <div className="absolute w-32 h-32 bg-blue-500 left-12 top-12 z-10 flex items-center justify-center text-white">z-index: 1</div>
        <div className="absolute w-32 h-32 bg-green-500 left-20 top-20 flex items-center justify-center text-white">z-index: auto</div>
      </div>
    ),
    afterDemo: (
      <div className="relative h-48 border-2 border-gray-300 p-2">
        <div className="absolute w-32 h-32 bg-red-500 left-4 top-4 z-20 flex items-center justify-center text-white">z-index: 2</div>
        <div className="absolute w-32 h-32 bg-blue-500 left-12 top-12 z-10 flex items-center justify-center text-white">z-index: 1</div>
        <div className="absolute w-32 h-32 bg-green-500 left-20 top-20 z-30 flex items-center justify-center text-white">z-index: 3</div>
      </div>
    )
  },
  {
    title: "ボックスモデルの解釈の違い",
    description: "ブラウザによってボックスモデルの解釈が異なり、レイアウトが崩れる問題です。",
    background: "古いIEとモダンブラウザでボックスモデルの計算方法が異なっていました。",
    solution: "box-sizing: border-boxを使用して統一するか、モダンなリセットCSSやNormalize.cssを使用します。",
    beforeCode: `
.box-content {
  box-sizing: content-box;
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid #333;
}
    `,
    afterCode: `
.box-border {
  box-sizing: border-box;
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid #333;
}
    `,
    beforeDemo: (
      <div className="space-y-4">
        <div className="w-64 h-32 p-5 border-4 border-gray-500 bg-blue-200">
          <p className="text-sm">content-box</p>
          <p className="text-xs">幅: 200px + padding + border</p>
        </div>
        <div className="w-64 h-32 bg-gray-200 flex items-center justify-center">
          <div className="w-52 h-24 bg-red-200 flex items-center justify-center">
            <p className="text-xs">実際の内容: 200px x 100px</p>
          </div>
        </div>
      </div>
    ),
    afterDemo: (
      <div className="space-y-4">
        <div className="w-64 h-32 p-5 border-4 border-gray-500 bg-green-200 box-border">
          <p className="text-sm">border-box</p>
          <p className="text-xs">幅: 200px (padding と border を含む)</p>
        </div>
        <div className="w-64 h-32 bg-gray-200 flex items-center justify-center">
          <div className="w-52 h-24 bg-red-200 flex items-center justify-center">
            <p className="text-xs">実際の内容: 152px x 52px</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "垂直方向の中央揃えの難しさ",
    description: "CSSで要素を垂直方向に中央揃えするのが難しい問題です。",
    background: "初期のCSSにはこの機能が不足していました。",
    solution: "Flexboxを使用する（display: flex; align-items: center;）か、CSS Gridを使用します。古い方法として、絶対位置指定とtransformを組み合わせる方法もあります。",
    beforeCode: `
.container {
  height: 200px;
  border: 2px solid #333;
}

.content {
  background-color: #3498db;
  padding: 20px;
  color: white;
}
    `,
    afterCode: `
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 2px solid #333;
}

.content {
  background-color: #3498db;
  padding: 20px;
  color: white;
}
    `,
    beforeDemo: (
      <div className="h-48 border-2 border-gray-300 relative">
        <div className="bg-blue-500 p-4 text-white absolute left-1/2 transform -translate-x-1/2">
          中央揃えされていない
        </div>
      </div>
    ),
    afterDemo: (
      <div className="flex items-center justify-center h-48 border-2 border-gray-300">
        <div className="bg-green-500 p-4 text-white">
          Flexbox中央揃え
        </div>
      </div>
    )
  },
]

function ProblemCard({ problem }: { problem: Problem }) {
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    setIsExpanded(true)
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          {problem.title}
          <span className="text-sm text-gray-500">{isExpanded ? '閉じる' : '開く'}</span>
        </CardTitle>
        <CardDescription>{problem.description}</CardDescription>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">背景：</h3>
              <p>{problem.background}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">解決策：</h3>
              <p>{problem.solution}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">コード例：</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">問題発生時：</h4>
                  <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">{problem.beforeCode}</pre>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">対処後：</h4>
                  <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">{problem.afterCode}</pre>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">デモ：</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">問題発生時：</h4>
                  {problem.beforeDemo}
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">対処後：</h4>
                  {problem.afterDemo}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default function Component() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">CSSの一般的な問題と解決策</h1>
      <div className="space-y-6">
        {problems.map((problem) => (
          <ProblemCard key={problem.title} problem={problem} />
        ))}
      </div>
    </div>
  )
}
