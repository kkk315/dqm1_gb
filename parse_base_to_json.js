const fs = require('fs');
const path = require('path');

// base.txtファイルのパス
const filePath = path.join(__dirname, 'data', 'base.txt');

try {
    // ファイルを読み込み
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 各行に分割
    const lines = content.split('\n');
    
    const result = [];
    let currentMonster = null;
    let currentFamily = null;
    
    lines.forEach((line, index) => {
        // 空行をスキップ
        if (line.trim() === '') {
            return;
        }
        
        // /で分割（最大4つまで）
        const parts = line.split('/');
        
        // 4つ未満の場合は空文字で埋める
        while (parts.length < 4) {
            parts.push('');
        }
        
        const [child, bloodline, partner, note] = parts;
        
        console.log(`行 ${index + 1}: [${child}] [${bloodline}] [${partner}] [${note}]`);
        
        // 1. [1]と[2]が空白の場合、[0]の文字列を系統名にセット
        if (bloodline === '' && partner === '') {
            currentFamily = child;
            console.log(`  → 系統設定: ${currentFamily}`);
        }
        // 2. [0][1][2]が空白ではない場合、[0]を子、[1]を血統、[2]を相手とするデータを作成する
        else if (child !== '' && bloodline !== '' && partner !== '') {
            // 血統と相手を空白で分割し、複数ある場合は配列にする
            const bloodlineList = bloodline.trim().split(/\s+/);
            const partnerList = partner.trim().split(/\s+/);
            
            currentMonster = {
                "子": child,
                "系統": currentFamily || "不明",
                "patterns": [{
                    "血統": bloodlineList.length === 1 ? bloodlineList[0] : bloodlineList,
                    "相手": partnerList.length === 1 ? partnerList[0] : partnerList
                }]
            };
            result.push(currentMonster);
            console.log(`  → 新モンスター作成: ${child} (系統: ${currentFamily})`);
            console.log(`    パターン: ${bloodline} × ${partner}`);
        }
        // 3. [0]が空白で[1][2]が空白ではない場合、直前のデータのパターンに追加する
        else if (child === '' && bloodline !== '' && partner !== '') {
            if (currentMonster) {
                // 血統と相手を空白で分割し、複数ある場合は配列にする
                const bloodlineList = bloodline.trim().split(/\s+/);
                const partnerList = partner.trim().split(/\s+/);
                
                currentMonster.patterns.push({
                    "血統": bloodlineList.length === 1 ? bloodlineList[0] : bloodlineList,
                    "相手": partnerList.length === 1 ? partnerList[0] : partnerList
                });
                console.log(`  → パターン追加: ${bloodline} × ${partner}`);
            } else {
                console.log(`  → エラー: 追加先のモンスターが見つかりません`);
            }
        }
        else {
            console.log(`  → スキップ: 条件に合致しません`);
        }
    });
    
    // JSONファイルとして出力
    const outputPath = path.join(__dirname, 'data', 'parsed_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    
    console.log('\n=== 変換完了 ===');
    console.log(`出力ファイル: ${outputPath}`);
    console.log(`変換されたモンスター数: ${result.length}`);
    
    // 統計情報を表示
    let totalPatterns = 0;
    result.forEach(monster => {
        totalPatterns += monster.patterns.length;
    });
    
    console.log(`総パターン数: ${totalPatterns}`);
    
    // 最初の5つのモンスターを表示（確認用）
    console.log('\n=== 変換結果サンプル ===');
    result.slice(0, 5).forEach((monster, index) => {
        console.log(`${index + 1}. ${monster.子} (${monster.系統}系)`);
        monster.patterns.forEach((pattern, pIndex) => {
            console.log(`   パターン${pIndex + 1}: ${pattern.血統} × ${pattern.相手}`);
        });
    });
    
} catch (error) {
    console.error('エラー:', error.message);
}
