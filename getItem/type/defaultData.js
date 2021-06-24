export const categories = [
  { code: 2016929051, keyword: 'DIY・工具・ガーデン' },
  { code: 561958, keyword: 'DVD' },
  { code: 637392, keyword: 'PCソフト' },
  { code: 13299531, keyword: 'おもちゃ' },
  { code: 637394, keyword: 'ゲーム ' },
  { code: 2016926051, keyword: 'シューズ&バッグ' },
  { code: 85895051, keyword: 'ジュエリー' },
  { code: 14304371, keyword: 'スポーツ&アウトドア ' },
  { code: 2128134051, keyword: 'デジタルミュージック' },
  { code: 2127209051, keyword: 'パソコン・周辺機器 ' },
  { code: 2229202051, keyword: 'ファッション' },
]

export const keywords = [
  '並行輸入',
  '輸入',
  'import',
  'インポート',
  '海外',
  '北米',
  '国名',
  '日本未発売',
]

export const cellName = [
  { text: 'Item: Weight (g)', field: 'Weight', type: 'Number' },
  { text: '商品名', field: 'title', type: 'String' },
  { text: 'Reviews: レビュー数', field: 'ReviewsNumber', type: 'Number' },
  { text: 'Reviews: 評価', field: 'Reviews', type: 'Number' },
  { text: '売れ筋ランキング: Drops last 90 days', field: 'RankingDrop90', type: 'Number' },
  { text: '売れ筋ランキング: Drops last 30 days', field: 'RankingDrop30', type: 'Number' },
  { text: '売れ筋ランキング: Drops last 180 days', field: 'RankingDrop180', type: 'Number' },
  { text: '売れ筋ランキング: 現在価格', field: 'ranking', type: 'Number', omit: [','] },
  { text: '新品: 現在価格', field: 'priceInJp', type: 'Number', omit: ['¥ ', ','] },
  { text: '新品アイテム数: 90 days avg.', field: 'NewItemNum90', type: 'Number' },
  { text: '新品アイテム数: 現在価格', field: 'NewItemNum', type: 'Number' },
  { text: 'カテゴリ: Root', field: 'category', type: 'String' },
  { text: 'ASIN', field: 'asin', type: 'String' },
  { text: 'Package: Dimension (cm³)', field: 'PackageDimension', type: 'String' },
  { text: 'Item: Dimension (cm³)', field: 'ItemDimension', type: 'String' },
]
