// ===== EXAMSHIELD — COURSE PROFILE SYSTEM =====
// Comprehensive course tree: School → College → PG
// Personalized subjects for PYQ, Flashcards, Suggestions, AI context

const PROFILE_KEY = 'er_profile';

// ===== FULL COURSE TREE =====
const COURSE_TREE = {
    school: {
        label: '🏫 School (Class 9–12)',
        icon: '🏫',
        streams: {
            class9_10: {
                label: 'Class 9–10 (General)',
                subjects: ['Mathematics', 'Science (Physics)', 'Science (Chemistry)', 'Science (Biology)', 'Social Science', 'English', 'Hindi', 'Computer Applications', 'Sanskrit'],
                suggestions: ['Explain the Pythagorean theorem', 'What are Newton\'s 3 laws?', 'Structure of an atom', 'Types of chemical reactions', 'What is photosynthesis?', 'Democratic government structure']
            },
            pcm: {
                label: 'Class 11–12: PCM (Physics, Chemistry, Maths)',
                subjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Computer Science', 'Physical Education'],
                suggestions: ['Explain Gauss\'s Law with derivation', 'Hybridization in organic chemistry', 'Limits and continuity in calculus', 'Thermodynamics 1st and 2nd law', 'Binomial theorem applications', 'Electrochemistry concepts']
            },
            pcb: {
                label: 'Class 11–12: PCB (Physics, Chemistry, Biology)',
                subjects: ['Physics', 'Chemistry', 'Biology', 'English', 'Physical Education'],
                suggestions: ['Cell division meiosis vs mitosis', 'DNA replication mechanism', 'Explain Mendelian genetics', 'Human respiratory system', 'Organic chemistry reactions', 'Ecosystem and food chains']
            },
            commerce: {
                label: 'Class 11–12: Commerce (Business Studies, Accounts)',
                subjects: ['Business Studies', 'Accountancy', 'Economics', 'Mathematics', 'English', 'Entrepreneurship', 'Physical Education'],
                suggestions: ['Journal entries in accounting', 'Demand and supply curves', 'Company formation process', 'Trial balance preparation', 'Marketing concepts explained', 'Types of business organizations']
            },
            arts_humanities: {
                label: 'Class 11–12: Humanities / Arts',
                subjects: ['History', 'Geography', 'Political Science', 'Economics', 'Sociology', 'Psychology', 'English', 'Philosophy', 'Legal Studies'],
                suggestions: ['Explain Indian independence movement', 'Principles of democracy', 'Human geography concepts', 'Sociological perspectives', 'Economic concepts for beginners', 'Psychological theories']
            }
        }
    },
    ug_engineering: {
        label: '⚙️ Engineering (BTech / BE)',
        icon: '⚙️',
        branches: {
            cse: {
                label: 'CSE – Computer Science & Engineering',
                specializations: {
                    general: { label: 'General CSE', subjects: ['Data Structures & Algorithms', 'Computer Networks', 'Operating Systems', 'DBMS', 'OOP (Java/C++)', 'C.O.A', 'Discrete Mathematics', 'Software Engineering', 'TOC', 'Python Programming', 'Engineering Mathematics', 'Digital Electronics'] },
                    iot_blockchain: { label: 'CSE – IoT & Blockchain', subjects: ['Data Structures & Algorithms', 'Computer Networks', 'Operating Systems', 'DBMS', 'OOP (Java/C++)', 'IoT Fundamentals', 'Blockchain Technology', 'Embedded Systems', 'Cloud Computing', 'Discrete Mathematics', 'Engineering Mathematics', 'Digital Electronics'] },
                    ai_ml: { label: 'CSE – AI & Machine Learning', subjects: ['Data Structures & Algorithms', 'Machine Learning', 'Deep Learning', 'Python for AI', 'Computer Networks', 'DBMS', 'Natural Language Processing', 'Computer Vision', 'Statistics & Prob.', 'Engineering Mathematics', 'OOP (Java/Python)', 'Operating Systems'] },
                    cybersecurity: { label: 'CSE – Cybersecurity', subjects: ['Data Structures & Algorithms', 'Computer Networks', 'Operating Systems', 'Cryptography', 'Ethical Hacking', 'Network Security', 'Digital Forensics', 'DBMS', 'Software Security', 'Engineering Mathematics', 'Linux & Shell Scripting', 'Web Security'] }
                }
            },
            ece: {
                label: 'ECE – Electronics & Communication',
                specializations: {
                    general: { label: 'General ECE', subjects: ['Signals & Systems', 'Digital Electronics', 'Analog Electronics', 'Electromagnetic Theory', 'Communication Systems', 'VLSI Design', 'Microprocessors', 'Control Systems', 'Engineering Mathematics', 'Network Analysis', 'Digital Signal Processing', 'Antenna & Wave Propagation'] }
                }
            },
            mechanical: {
                label: 'Mechanical Engineering',
                specializations: {
                    general: { label: 'Mechanical Engineering', subjects: ['Engineering Mechanics', 'Thermodynamics', 'Fluid Mechanics', 'Theory of Machines', 'Strength of Materials', 'Manufacturing Process', 'Heat Transfer', 'Engineering Drawing', 'Engineering Mathematics', 'Industrial Engineering', 'CAD/CAM', 'Machine Design'] }
                }
            },
            civil: {
                label: 'Civil Engineering',
                specializations: {
                    general: { label: 'Civil Engineering', subjects: ['Structural Analysis', 'Concrete Technology', 'Fluid Mechanics', 'Soil Mechanics', 'Surveying', 'Environmental Engineering', 'Transportation Engineering', 'Engineering Mathematics', 'Building Materials', 'Hydraulics', 'Foundation Engineering', 'Engineering Drawing'] }
                }
            },
            electrical: {
                label: 'EEE – Electrical Engineering',
                specializations: {
                    general: { label: 'Electrical Engineering', subjects: ['Electrical Circuits', 'Power Systems', 'Electrical Machines', 'Control Systems', 'Power Electronics', 'Digital Electronics', 'Electromagnetic Theory', 'Engineering Mathematics', 'Instrumentation', 'Renewable Energy', 'Drives & Control', 'Signal Processing'] }
                }
            }
        }
    },
    ug_science: {
        label: '🔬 Science (BSc)',
        icon: '🔬',
        branches: {
            bsc_cs: { label: 'BSc Computer Science', subjects: ['Programming in C/C++', 'Data Structures', 'Computer Networks', 'DBMS', 'Operating Systems', 'Web Technologies', 'Software Engineering', 'Mathematics', 'Statistics', 'Algorithm Design', 'Mobile Computing', 'Cyber Security'] },
            bsc_maths: { label: 'BSc Mathematics', subjects: ['Real Analysis', 'Linear Algebra', 'Abstract Algebra', 'Differential Equations', 'Numerical Methods', 'Probability & Statistics', 'Topology', 'Complex Analysis', 'Discrete Mathematics', 'Operations Research', 'Number Theory', 'Calculus'] },
            bsc_physics: { label: 'BSc Physics', subjects: ['Classical Mechanics', 'Quantum Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Electronics', 'Mathematical Physics', 'Nuclear Physics', 'Statistical Mechanics', 'Solid State Physics', 'Spectroscopy'] },
            bsc_chemistry: { label: 'BSc Chemistry', subjects: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Biochemistry', 'Spectroscopy', 'Thermodynamics', 'Chemical Kinetics', 'Electrochemistry', 'Industrial Chemistry', 'Environmental Chemistry', 'Polymer Chemistry'] },
            bsc_biology: { label: 'BSc Biology / Biotechnology', subjects: ['Cell Biology', 'Genetics', 'Microbiology', 'Biochemistry', 'Ecology', 'Anatomy', 'Physiology', 'Molecular Biology', 'Immunology', 'Biotechnology', 'Zoology', 'Botany'] }
        }
    },
    ug_commerce_management: {
        label: '📊 Commerce & Management',
        icon: '📊',
        branches: {
            bca: { label: 'BCA – Computer Applications', subjects: ['Programming (C/Java)', 'Data Structures', 'DBMS', 'Computer Networks', 'Web Development', 'Software Engineering', 'Operating Systems', 'Mathematics', 'Statistics', 'E-Commerce', 'Mobile App Development', 'Python Programming'] },
            bba: { label: 'BBA – Business Administration', subjects: ['Principles of Management', 'Business Economics', 'Accounting', 'Marketing Management', 'Human Resource Management', 'Financial Management', 'Business Law', 'Business Statistics', 'Operations Management', 'Organizational Behaviour', 'Entrepreneurship', 'International Business'] },
            bcom: { label: 'BCom – Commerce', subjects: ['Financial Accounting', 'Business Law', 'Economics', 'Taxation', 'Cost Accounting', 'Business Statistics', 'Company Law', 'Auditing', 'Banking', 'Business Mathematics', 'Management Accounting', 'E-Commerce'] }
        }
    },
    ug_law_medical: {
        label: '⚖️ Law / Medical / Other',
        icon: '⚖️',
        branches: {
            llb: { label: 'LLB – Law', subjects: ['Constitutional Law', 'Criminal Law (IPC)', 'Contract Law', 'Property Law', 'Family Law', 'Civil Procedure Code', 'Law of Evidence', 'Administrative Law', 'Company Law', 'Torts', 'International Law', 'Labour Law'] },
            mbbs: { label: 'MBBS – Medicine', subjects: ['Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Microbiology', 'Forensic Medicine', 'Community Medicine', 'Internal Medicine', 'Surgery', 'Obstetrics & Gynecology', 'Pediatrics'] },
            bpharm: { label: 'BPharm – Pharmacy', subjects: ['Pharmaceutics', 'Pharmaceutical Chemistry', 'Pharmacology', 'Pharmacognosy', 'Biochemistry', 'Microbiology', 'Clinical Pharmacy', 'Biopharmaceutics', 'Pharmaceutical Analysis', 'Hospital Pharmacy', 'Industrial Pharmacy', 'Drug Regulatory Affairs'] },
            architecture: { label: 'BArch – Architecture', subjects: ['Architectural Design', 'Building Construction', 'Structural Systems', 'History of Architecture', 'Environmental Studies', 'Urban Design', 'Landscape Architecture', 'Computer-Aided Design', 'Interior Design', 'Sustainable Architecture', 'Building Services', 'Project Management'] }
        }
    },
    pg: {
        label: '🎓 Post-Graduate (PG)',
        icon: '🎓',
        branches: {
            mtech_cse: { label: 'MTech CSE / Computer Science', subjects: ['Advanced Algorithms', 'Advanced DBMS', 'Machine Learning', 'Cloud Computing', 'Research Methodology', 'Distributed Computing', 'Advanced Computer Networks', 'Compiler Design', 'Information Security', 'Soft Computing', 'Big Data Analytics', 'Computer Vision'] },
            mba: { label: 'MBA – Business Administration', subjects: ['Strategic Management', 'Financial Management', 'Marketing Strategy', 'Operations Management', 'Business Economics', 'Human Resource Management', 'Research Methods', 'Business Analytics', 'International Business', 'Leadership & Ethics', 'Supply Chain Management', 'Corporate Finance'] },
            mca: { label: 'MCA – Computer Applications', subjects: ['Advanced Java', 'Data Mining', 'Software Testing', 'Cloud Computing', 'Advanced DBMS', 'Computer Networks', 'Machine Learning', 'Distributed Systems', 'Mobile Computing', 'Research Methodology', 'Software Project Management', 'Information Security'] },
            msc_cs: { label: 'MSc Computer Science', subjects: ['Advanced Algorithms', 'Machine Learning', 'Computer Vision', 'Advanced Computer Networks', 'Research Methodology', 'Parallel Computing', 'Cryptography', 'Natural Language Processing', 'High Performance Computing', 'Advanced DBMS', 'Formal Methods', 'Software Engineering'] }
        }
    }
};

// ===== PROFILE HELPERS =====
function getProfile() { return LS.get(PROFILE_KEY, null); }
function saveProfile(profile) { LS.set(PROFILE_KEY, profile); }

function getSubjects() {
    const p = getProfile();
    if (!p) return ['General Studies', 'Mathematics', 'Science', 'English'];
    return p.subjects || ['General Studies'];
}

function getCourseLabel() {
    const p = getProfile();
    if (!p) return null;
    return p.courseLabel || 'Your Course';
}

function buildSuggestionsForProfile() {
    const p = getProfile();
    if (!p) return [];
    if (p.suggestions) return p.suggestions;
    if (p.category === 'school') {
        const stream = COURSE_TREE.school.streams[p.stream];
        return stream?.suggestions || [];
    }
    return [];
}

// ===== PROFILE ONBOARDING MODAL =====
function showProfileModal(forceShow = false) {
    if (!forceShow && getProfile()) return; // already set

    // Remove any existing modal
    document.getElementById('profile-modal-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'profile-modal-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px';

    overlay.innerHTML = `
    <div id="profile-modal" style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius-xl);width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,0.7)">
      <!-- Header -->
      <div style="background:var(--gradient-hero);border-radius:var(--radius-xl) var(--radius-xl) 0 0;padding:28px 28px 24px;text-align:center;border-bottom:1px solid var(--border-color)">
        <div style="font-size:48px;margin-bottom:8px">🎓</div>
        <div style="font-family:var(--font-heading);font-size:26px;font-weight:900;margin-bottom:6px">Welcome to <span style="background:linear-gradient(90deg,#c4b5fd,#93c5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">ExamShield</span></div>
        <div style="font-size:14px;color:rgba(255,255,255,0.65)">Tell us what you're studying — we'll personalize everything for you 🎯</div>
      </div>

      <div style="padding:24px">
        <!-- Step 1: Education Level -->
        <div id="step-1">
          <div style="font-family:var(--font-heading);font-size:17px;font-weight:700;margin-bottom:4px">Step 1 — Education Level</div>
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">Choose your current level of study</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" id="level-grid">
            ${Object.entries(COURSE_TREE).map(([key, cat]) => `
              <button class="profile-choice-btn" data-level="${key}" onclick="selectLevel('${key}', this)" style="padding:14px;border:1px solid var(--border-color);border-radius:var(--radius-md);background:var(--bg-card);cursor:pointer;text-align:left;transition:all 0.2s;color:var(--text-primary)">
                <div style="font-size:22px;margin-bottom:4px">${cat.icon}</div>
                <div style="font-size:13px;font-weight:600;line-height:1.3">${cat.label}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Step 2: Branch/Stream -->
        <div id="step-2" style="display:none">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
            <button onclick="goBackStep()" style="background:none;border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:6px 12px;color:var(--text-secondary);cursor:pointer;font-size:13px">← Back</button>
            <div style="font-family:var(--font-heading);font-size:17px;font-weight:700">Step 2 — Course / Stream</div>
          </div>
          <div id="branch-grid" style="display:flex;flex-direction:column;gap:8px"></div>
        </div>

        <!-- Step 3: Specialization -->
        <div id="step-3" style="display:none">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
            <button onclick="goBackStep2()" style="background:none;border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:6px 12px;color:var(--text-secondary);cursor:pointer;font-size:13px">← Back</button>
            <div style="font-family:var(--font-heading);font-size:17px;font-weight:700">Step 3 — Specialization</div>
          </div>
          <div id="spec-grid" style="display:flex;flex-direction:column;gap:8px"></div>
        </div>
      </div>
    </div>
  `;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `.profile-choice-btn:hover { border-color: var(--accent) !important; background: rgba(139,92,246,0.15) !important; } .profile-choice-btn.selected { border-color: var(--accent) !important; background: rgba(139,92,246,0.2) !important; }`;
    document.head.appendChild(style);
    document.body.appendChild(overlay);
}

let _selectedLevel = null;
let _selectedBranch = null;

function selectLevel(level, btn) {
    _selectedLevel = level;
    document.querySelectorAll('.profile-choice-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    setTimeout(() => {
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'block';
        const cat = COURSE_TREE[level];
        const grid = document.getElementById('branch-grid');

        if (level === 'school') {
            grid.innerHTML = Object.entries(cat.streams).map(([key, stream]) => `
        <button class="profile-choice-btn" onclick="selectStreamFinal('${key}')" style="padding:14px 16px;border:1px solid var(--border-color);border-radius:var(--radius-md);background:var(--bg-card);cursor:pointer;text-align:left;color:var(--text-primary);width:100%">
          <div style="font-size:14px;font-weight:600">${stream.label}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:3px">${stream.subjects.slice(0, 4).join(' · ')}</div>
        </button>
      `).join('');
        } else {
            const subKey = level === 'pg' ? 'branches' : level === 'ug_science' ? 'branches' : level === 'ug_commerce_management' ? 'branches' : level === 'ug_law_medical' ? 'branches' : 'branches';
            const branches = cat.branches || cat.streams;
            grid.innerHTML = Object.entries(branches).map(([key, branch]) => {
                const hasSpecs = branch.specializations && Object.keys(branch.specializations).length > 1;
                return `
          <button class="profile-choice-btn" onclick="${hasSpecs ? `selectBranch('${key}')` : `selectBranchFinal('${key}')`}" style="padding:14px 16px;border:1px solid var(--border-color);border-radius:var(--radius-md);background:var(--bg-card);cursor:pointer;text-align:left;color:var(--text-primary);width:100%">
            <div style="font-size:14px;font-weight:600">${branch.label}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:3px">${(branch.subjects || Object.values(branch.specializations)[0]?.subjects || []).slice(0, 4).join(' · ')}</div>
          </button>
        `;
            }).join('');
        }
    }, 150);
}

function selectStreamFinal(streamKey) {
    const stream = COURSE_TREE.school.streams[streamKey];
    const profile = {
        category: 'school',
        level: 'school',
        stream: streamKey,
        courseLabel: stream.label,
        subjects: stream.subjects,
        suggestions: stream.suggestions
    };
    finalizeProfile(profile);
}

function selectBranch(branchKey) {
    _selectedBranch = branchKey;
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-3').style.display = 'block';
    const cat = COURSE_TREE[_selectedLevel];
    const branch = cat.branches[branchKey];
    const grid = document.getElementById('spec-grid');
    grid.innerHTML = Object.entries(branch.specializations).map(([key, spec]) => `
    <button class="profile-choice-btn" onclick="selectSpecFinal('${key}')" style="padding:14px 16px;border:1px solid var(--border-color);border-radius:var(--radius-md);background:var(--bg-card);cursor:pointer;text-align:left;color:var(--text-primary);width:100%">
      <div style="font-size:14px;font-weight:600">${spec.label}</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:3px">${spec.subjects.slice(0, 4).join(' · ')}</div>
    </button>
  `).join('');
}

function selectBranchFinal(branchKey) {
    const cat = COURSE_TREE[_selectedLevel];
    const branch = cat.branches[branchKey];
    const spec = Object.values(branch.specializations || {})[0];
    const subjects = branch.subjects || spec?.subjects || [];
    const profile = {
        category: _selectedLevel,
        branch: branchKey,
        courseLabel: branch.label,
        subjects,
        suggestions: []
    };
    finalizeProfile(profile);
}

function selectSpecFinal(specKey) {
    const cat = COURSE_TREE[_selectedLevel];
    const branch = cat.branches[_selectedBranch];
    const spec = branch.specializations[specKey];
    const profile = {
        category: _selectedLevel,
        branch: _selectedBranch,
        specialization: specKey,
        courseLabel: spec.label,
        subjects: spec.subjects,
        suggestions: []
    };
    finalizeProfile(profile);
}

function goBackStep() {
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-1').style.display = 'block';
}

function goBackStep2() {
    document.getElementById('step-3').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

function finalizeProfile(profile) {
    saveProfile(profile);
    document.getElementById('profile-modal-overlay')?.remove();
    // Update sidebar to show course
    buildSidebar(window._activeHref || 'index.html');
    if (typeof toast === 'function') toast(`Course set: ${profile.courseLabel} 🎉`, '✅');
    // Reload subjects in dynamic pages if applicable
    if (typeof renderSubjectDropdown === 'function') renderSubjectDropdown();
}
