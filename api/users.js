export default async function handler(req, res) {
    // CORS 허용 (모든 도메인에서 요청 가능)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_NAME = process.env.GITHUB_REPO || 'Hisaki0/startup-kit';
    const filePath = 'users.json';

    const url = `https://api.github.com/repos/${REPO_NAME}/contents/${filePath}`;

    try {
        if (req.method === 'GET') {
            const response = await fetch(url, {
                headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
            });
            if (!response.ok) return res.status(200).json({}); // 파일 없으면 빈 객체 반환
            const data = await response.json();
            const decodedContent = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
            return res.status(200).json(decodedContent);
        }

        if (req.method === 'POST') {
            const newUsersData = req.body; // 클라이언트에서 보낸 최신 회원 데이터 객체

            // 1. 기존 파일의 SHA 값 가져오기 (GitHub API 요구사항)
            const getRes = await fetch(url, {
                headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
            });
            let sha = '';
            if (getRes.ok) {
                const fileData = await getRes.json();
                sha = fileData.sha;
            }

            // 2. GitHub에 업데이트 요청 (PUT)
            const contentEncoded = Buffer.from(JSON.stringify(newUsersData, null, 2)).toString('base64');
            const updateRes = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update users.json via Serverless API',
                    content: contentEncoded,
                    sha: sha ? sha : undefined
                })
            });

            if (!updateRes.ok) {
                const errText = await updateRes.text();
                return res.status(500).json({ error: 'GitHub update failed', details: errText });
            }

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
