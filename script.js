document.addEventListener("DOMContentLoaded", () => {
    initDefaultPosts();
    checkLoginState();
    if(document.getElementById('post-ul')) {
        loadPosts();
    }
});

function handleRegister() {
    const id = document.getElementById('reg_id').value.trim();
    let nick = document.getElementById('reg_nick').value.trim();
    const pw = document.getElementById('reg_pw').value.trim();
    if(!id || !nick || !pw) { alert('모든 항목을 정확히 입력해주세요.'); return; }
    
    if(id === 'dta0704') {
        nick = '관리자';
    }

    let users = JSON.parse(localStorage.getItem('startup_users') || '{}');
    if(users[id]) { alert('이미 존재하는 아이디입니다.'); return; }

    users[id] = { pw, nick };
    localStorage.setItem('startup_users', JSON.stringify(users));
    alert('회원가입이 완료되었습니다. 로그인해 주세요.');
    document.getElementById('reg_id').value = '';
    document.getElementById('reg_nick').value = '';
    document.getElementById('reg_pw').value = '';
}

function handleLogin() {
    const id = document.getElementById('login_id').value.trim();
    const pw = document.getElementById('login_pw').value.trim();
    let users = JSON.parse(localStorage.getItem('startup_users') || '{}');

    if(!users[id] || users[id].pw !== pw) { alert('아이디 또는 비밀번호가 일치하지 않습니다.'); return; }

    let nick = users[id].nick;
    if(id === 'dta0704') {
        nick = '관리자';
    }

    localStorage.setItem('startup_logged_user', JSON.stringify({ id, nick }));
    alert(`${nick}님, 환영합니다.`);
    checkLoginState();
    window.location.href = 'community.html';
}

function handleLogout() {
    localStorage.removeItem('startup_logged_user');
    checkLoginState();
    alert('안전하게 로그아웃되었습니다.');
    window.location.href = 'index.html';
}

function checkLoginState() {
    const logged = JSON.parse(localStorage.getItem('startup_logged_user'));
    const welcomeMsg = document.getElementById('welcome-msg');
    const authLinkBtn = document.getElementById('auth-link-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const authForms = document.getElementById('auth-forms');
    const authStatus = document.getElementById('auth-status');
    const loggedUserInfo = document.getElementById('logged-user-info');
    const adminNotice = document.getElementById('admin-notice');
    const writeBtn = document.getElementById('write-btn');

    if(logged) {
        if(welcomeMsg) welcomeMsg.innerHTML = `${logged.nick} 님`;
        if(authLinkBtn) authLinkBtn.style.display = 'none';
        if(logoutBtn) logoutBtn.style.display = 'inline-block';
        if(authForms) authForms.style.display = 'none';
        if(authStatus) authStatus.style.display = 'block';
        if(loggedUserInfo) loggedUserInfo.innerText = `현재 접속 계정: ${logged.nick} (${logged.id})`;
        
        if(logged.id === 'dta0704') {
            if(adminNotice) adminNotice.style.display = 'block';
        } else {
            if(adminNotice) adminNotice.style.display = 'none';
        }
        if(writeBtn) writeBtn.style.display = 'inline-block';
    } else {
        if(welcomeMsg) welcomeMsg.innerText = '인증 필요';
        if(authLinkBtn) authLinkBtn.style.display = 'inline-block';
        if(logoutBtn) logoutBtn.style.display = 'none';
        if(authForms) authForms.style.display = 'block';
        if(authStatus) authStatus.style.display = 'none';
        if(writeBtn) writeBtn.style.display = 'none';
    }
}

function openFindModal(type) {
    const modal = document.getElementById('findModal');
    modal.style.display = 'flex';
    if(type === 'id') {
        document.getElementById('modal-title').innerText = '아이디 찾기';
        document.getElementById('find-id-section').style.display = 'block';
        document.getElementById('find-pw-section').style.display = 'none';
        document.getElementById('result_found_id').innerText = '';
    } else {
        document.getElementById('modal-title').innerText = '비밀번호 재설정';
        document.getElementById('find-id-section').style.display = 'none';
        document.getElementById('find-pw-section').style.display = 'block';
        document.getElementById('result_found_pw').innerText = '';
    }
}

function closeFindModal() {
    document.getElementById('findModal').style.display = 'none';
}

function executeFindId() {
    const targetNick = document.getElementById('find_nick_input').value.trim();
    let users = JSON.parse(localStorage.getItem('startup_users') || '{}');
    let foundId = null;

    for (let id in users) {
        if (users[id].nick === targetNick) {
            foundId = id;
            break;
        }
    }

    const resBox = document.getElementById('result_found_id');
    if (foundId) {
        resBox.innerText = `🔍 찾은 아이디: [ ${foundId} ]`;
    } else {
        resBox.innerText = `❌ 일치하는 닉네임의 계정이 없습니다.`;
    }
}

function executeResetPw() {
    const targetId = document.getElementById('find_pw_id').value.trim();
    const targetNick = document.getElementById('find_pw_nick').value.trim();
    const newPw = document.getElementById('new_pw_input').value.trim();
    let users = JSON.parse(localStorage.getItem('startup_users') || '{}');
    const resBox = document.getElementById('result_found_pw');

    if (!users[targetId]) {
        resBox.innerText = `❌ 존재하지 않는 아이디입니다.`;
        return;
    }

    if (users[targetId].nick !== targetNick) {
        resBox.innerText = `❌ 아이디와 닉네임 정보가 일치하지 않습니다.`;
        return;
    }

    if (!newPw) {
        resBox.innerText = `❌ 새 비밀번호를 입력해주세요.`;
        return;
    }

    users[targetId].pw = newPw;
    localStorage.setItem('startup_users', JSON.stringify(users));
    resBox.innerText = `✅ 비밀번호가 성공적으로 재설정되었습니다!`;
}

function initDefaultPosts() {
    if(!localStorage.getItem('startup_posts')) {
        const defaultPosts = [
            {
                id: 1,
                title: '[공식 가이드] 초기 창업 패키지 및 세무사 활용 꿀팁 총정리',
                nick: '관리자',
                date: '2026-09-06',
                content: '대한민국 예비 창업자 및 소상공인 여러분을 위한 필수 지식 가이드입니다. 초기에는 간이과세자로 시작해 매출 추이를 확인하는 것이 유리합니다.'
            },
            {
                id: 2,
                title: '직원 채용 시 4대보험 사업주 부담금 절감하는 실무 노하우',
                nick: '베테랑실무자',
                date: '2026-09-06',
                content: '식대 등의 비과세 항목을 정확히 분리하여 급여를 설계하면 인건비 지출 구조를 최적화할 수 있습니다. 상단 계산기를 활용해 보세요.'
            }
        ];
        localStorage.setItem('startup_posts', JSON.stringify(defaultPosts));
    }
}

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('startup_posts') || '[]');
    const ul = document.getElementById('post-ul');
    if(!ul) return;
    ul.innerHTML = '';
    
    const logged = JSON.parse(localStorage.getItem('startup_logged_user'));
    const isAdmin = logged && logged.id === 'dta0704';

    posts.forEach(post => {
        const li = document.createElement('li');
        li.className = 'post-item';
        
        let deleteBtnHtml = '';
        if (isAdmin) {
            deleteBtnHtml = `<button onclick="deletePost(event, ${post.id})" style="background:#7f1d1d; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer; margin-left:10px;">삭제</button>`;
        }

        li.innerHTML = `
            <div style="flex-grow: 1; cursor: pointer;" onclick="viewPost(${post.id})">
                <div class="post-title">${post.title}</div>
                <div class="post-meta">작성자: ${post.nick} | 등록일: ${post.date}</div>
            </div>
            <div>${deleteBtnHtml}</div>
        `;
        ul.appendChild(li);
    });
}

function toggleWriteForm() {
    const logged = JSON.parse(localStorage.getItem('startup_logged_user'));
    if(!logged) { alert('인사이트 글을 작성하려면 로그인이 필요합니다.'); window.location.href = 'index.html#auth'; return; }
    const writeSec = document.getElementById('write-section');
    writeSec.style.display = writeSec.style.display === 'none' ? 'block' : 'none';
}

function savePost() {
    const logged = JSON.parse(localStorage.getItem('startup_logged_user'));
    if(!logged) { alert('로그인 세션이 만료되었습니다.'); return; }

    const title = document.getElementById('post_title').value.trim();
    const content = document.getElementById('post_content').value.trim();
    if(!title || !content) { alert('제목과 본문 내용을 모두 입력해주세요.'); return; }

    let posts = JSON.parse(localStorage.getItem('startup_posts') || '[]');
    const newPost = {
        id: Date.now(),
        title,
        nick: logged.nick,
        date: new Date().toISOString().slice(0, 10),
        content
    };

    posts.unshift(newPost);
    localStorage.setItem('startup_posts', JSON.stringify(posts));
    document.getElementById('post_title').value = '';
    document.getElementById('post_content').value = '';
    document.getElementById('write-section').style.display = 'none';
    loadPosts();
}

function deletePost(event, id) {
    event.stopPropagation();
    if(!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;

    let posts = JSON.parse(localStorage.getItem('startup_posts') || '[]');
    posts = posts.filter(post => post.id !== id);
    localStorage.setItem('startup_posts', JSON.stringify(posts));
    loadPosts();
    backToList();
}

function viewPost(id) {
    const posts = JSON.parse(localStorage.getItem('startup_posts') || '[]');
    const post = posts.find(p => p.id === id);
    if(!post) return;

    document.getElementById('detail-title').innerText = post.title;
    document.getElementById('detail-meta').innerText = `작성자: ${post.nick} | 등록일: ${post.date}`;
    document.getElementById('detail-content').innerText = post.content;

    const logged = JSON.parse(localStorage.getItem('startup_logged_user'));
    const detailHeader = document.getElementById('detail-header-action');
    if (detailHeader) {
        if (logged && logged.id === 'dta0704') {
            detailHeader.innerHTML = `<button onclick="deletePost(event, ${post.id})" style="background:#7f1d1d; color:#fff; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-weight:bold;">게시글 삭제</button>`;
        } else {
            detailHeader.innerHTML = '';
        }
    }

    document.getElementById('post-list-container').style.display = 'none';
    document.getElementById('write-section').style.display = 'none';
    document.getElementById('post-detail-view').style.display = 'block';
}

function backToList() {
    document.getElementById('post-detail-view').style.display = 'none';
    document.getElementById('post-list-container').style.display = 'block';
}

function calcTax() {
    const sales = parseFloat(document.getElementById('v_sales').value) || 0;
    const purchase = parseFloat(document.getElementById('v_purchase').value) || 0;
    const valueRate = parseFloat(document.getElementById('v_industry').value);
    const ganiTax = Math.max(0, (sales * valueRate * 0.1) - (purchase * 0.1 * valueRate));
    const generalTax = Math.max(0, (sales * 0.1) - (purchase * 0.1));

    document.getElementById('res_gani').innerText = Math.round(ganiTax).toLocaleString() + ' 원';
    document.getElementById('res_general').innerText = Math.round(generalTax).toLocaleString() + ' 원';
    const diff = Math.abs(ganiTax - generalTax).toLocaleString();
    document.getElementById('res_winner').innerText = ganiTax < generalTax ? `👉 간이과세자가 약 ${diff} 원 더 유리합니다.` : `👉 일반과세자가 약 ${diff} 원 더 유리합니다.`;
    document.getElementById('tax-result').style.display = 'block';
}

function calcLabor() {
    const salary = parseFloat(document.getElementById('p_salary').value) || 0;
    const taxFree = parseFloat(document.getElementById('p_taxfree').value) || 0;
    const taxable = Math.max(0, salary - taxFree);
    const workerDeduct = Math.round(taxable * 0.09);
    const netPay = salary - workerDeduct;
    const bossInsurance = Math.round(taxable * 0.1015 + salary * 0.01);
    const totalExpense = salary + bossInsurance;

    document.getElementById('l_worker_deduct').innerText = workerDeduct.toLocaleString() + ' 원';
    document.getElementById('l_net_pay').innerText = netPay.toLocaleString() + ' 원';
    document.getElementById('l_boss_insurance').innerText = bossInsurance.toLocaleString() + ' 원';
    document.getElementById('l_total_expense').innerText = totalExpense.toLocaleString() + ' 원';
    document.getElementById('labor-result').style.display = 'block';
}

function calcDilution() {
    const myShare = parseFloat(document.getElementById('s_my_share').value) || 0;
    const partnerShare = parseFloat(document.getElementById('s_partner_share').value) || 0;
    const investShare = parseFloat(document.getElementById('s_invest_share').value) || 0;
    const dilutionFactor = (100 - investShare) / 100;

    document.getElementById('d_my_final').innerText = (myShare * dilutionFactor).toFixed(2) + ' %';
    document.getElementById('d_partner_final').innerText = (partnerShare * dilutionFactor).toFixed(2) + ' %';
    document.getElementById('d_invest_final').innerText = investShare.toFixed(2) + ' %';
    document.getElementById('dilution-result').style.display = 'block';
}