const fs = require('fs');
const path = require('path');

// base.txtファイルのパス
const filePath = path.join(__dirname, 'data', 'base.txt');

try {
    // ファイルを読み込み
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 各行に分割
    const lines = content.split('\n');
    
    console.log('=== base.txtの解析結果 ===\n');
    
    lines.forEach((line, index) => {
        // 空行をスキップ
        if (line.trim() === '') {
            return;
        }
        
        // /で分割
        const parts = line.split('/');
        
        console.log(`行 ${index + 1}: ${line}`);
        console.log(`分割結果 (${parts.length}個):`);
        parts.forEach((part, partIndex) => {
            console.log(`  [${partIndex}]: "${part}"`);
        });
        console.log('---');
    });
    
    console.log('\n=== 統計情報 ===');
    console.log(`総行数: ${lines.length}`);
    console.log(`空行を除く行数: ${lines.filter(line => line.trim() !== '').length}`);
    
} catch (error) {
    console.error('ファイル読み込みエラー:', error.message);
}
