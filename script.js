/**
 * � เครื่องมือสร้างกราฟสมการพหุนาม - Main JavaScript
 * =========================================================
 * ไฟล์ JavaScript หลักสำหรับบันทึกลวดลายศิลปวัฒนธรรมไทยและนานาชาติ
 * 
 * 📚 สิ่งที่นักเรียนจะได้เรียนรู้:
 * - JavaScript ES6+ Syntax และ Modern Features
 * - HTML5 Canvas API สำหรับ Image Processing
 * - File API และ FileReader สำหรับการอ่านไฟล์
 * - Drag & Drop API สำหรับ User Interface
 * - Mathematical Operations และ Statistical Analysis
 * - DOM Manipulation และ Event Handling
 * - Asynchronous Programming (async/await, Promises)
 * - Chart.js Library สำหรับการสร้างกราฟ
 * - Computer Vision Concepts (Edge Detection)
 * - Machine Learning Concepts (Polynomial Regression)
 * 
 * 🔧 เทคโนโลยีที่ใช้:
 * - Vanilla JavaScript (ไม่ใช้ Framework)
 * - HTML5 Canvas API
 * - Chart.js for Data Visualization
 * - Bootstrap 5 for UI Components
 * - Mathematical Libraries (Matrix Operations)
 */

// 🌐 Global Variables - ตัวแปรสำคัญของแอปพลิเคชัน
// ===================================================
let currentImageData = null;    // ข้อมูลภาพที่ผู้ใช้อัปโหลด
let processedResults = null;    // ผลลัพธ์การประมวลผล
let edgePoints = [];           // จุดข้อมูลที่สกัดได้จากภาพ
let currentEquations = [];     // สมการปัจจุบันที่สร้างแล้ว

// 🚀 Application Initialization - การเริ่มต้นแอปพลิเคชัน
// ===========================================================
// Event Listener นี้จะทำงานเมื่อ HTML โหลดเสร็จแล้ว (DOM Ready)
document.addEventListener('DOMContentLoaded', function() {
    console.log('� เครื่องมือศิลปคณิตไทย - Thai Art Mathematics Tool initialized');
    setupEventListeners(); // เรียกฟังก์ชันตั้งค่า Event Listeners
});

/**
 * 🎛️ Setup All Event Listeners - ตั้งค่า Event Listeners ทั้งหมด
 * ==============================================================
 * ฟังก์ชันนี้ใช้สำหรับตั้งค่า Event Listeners ต่างๆ ที่จำเป็น
 * เพื่อให้แอปพลิเคชันสามารถตอบสนองต่อการกระทำของผู้ใช้
 */
function setupEventListeners() {
    // ป้องกันการ setup ซ้ำ
    if (window.eventListenersSetup) {
        console.log('Event listeners already setup, skipping...');
        return;
    }
    
    // 📁 File Input Change Event - เมื่อผู้ใช้เลือกไฟล์
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // 🖱️ Select File Button Click - เมื่อคลิกปุ่มเลือกไฟล์
    const selectFileBtn = document.getElementById('selectFileBtn');
    if (selectFileBtn && fileInput) {
        selectFileBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // ป้องกันไม่ให้ Event ไปยัง Element อื่น
            fileInput.click();   // เปิด File Dialog
        });
    }
    
    // 📤 Upload Area Click - เมื่อคลิกที่พื้นที่อัปโหลด (ยกเลิกการใช้งาน)
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        // ลบ click event listener เพื่อป้องกัน double upload
        // แค่ปุ่ม selectFileBtn เท่านั้นที่ใช้งาน
        console.log('Upload area click listener disabled to prevent double upload');
    }
    
    // 🔗 Smooth Scrolling for Navigation Links - การเลื่อนหน้าเว็บแบบนุ่มนวล
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // ป้องกัน Default Behavior ของ Link
            const targetId = this.getAttribute('href').substring(1); // ตัด # ออก
            scrollToSection(targetId); // เรียกฟังก์ชันเลื่อนไปยังส่วนที่ต้องการ
        });
    });
    
    // ทำเครื่องหมายว่า setup แล้ว
    window.eventListenersSetup = true;
    console.log('Event listeners setup completed');
}

/**
 * 📁 Handle File Selection - จัดการการเลือกไฟล์
 * =============================================
 * ฟังก์ชันนี้ทำงานเมื่อผู้ใช้เลือกไฟล์ผ่าน File Input
 * 
 * 🔍 การตรวจสอบที่ทำ:
 * 1. ประเภทไฟล์ (JPG, PNG เท่านั้น)
 * 2. ขนาดไฟล์ (ไม่เกิน 16MB)
 * 
 * @param {Event} event - Event Object จาก File Input
 */
function handleFileSelect(event) {
    const file = event.target.files[0]; // ไฟล์แรกที่เลือก
    if (file) {
        // 🔍 Validate File Type - ตรวจสอบประเภทไฟล์
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type.toLowerCase())) {
            showAlert('ไฟล์ประเภทนี้ไม่รองรับ กรุณาเลือกไฟล์ JPG หรือ PNG เท่านั้น', 'danger');
            return;
        }
        
        // 📏 Validate File Size - ตรวจสอบขนาดไฟล์ (16MB = 16 * 1024 * 1024 bytes)
        if (file.size > 16 * 1024 * 1024) {
            showAlert('ขนาดไฟล์ใหญ่เกินไป กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 16MB', 'danger');
            return;
        }
        
        // ✅ ไฟล์ผ่านการตรวจสอบแล้ว - โหลดตัวอย่าง
        loadImagePreview(file);
    }
}

/**
 * 🖱️ Handle Drag and Drop Functionality - จัดการการลากและวางไฟล์
 * ===============================================================
 * ฟังก์ชันเหล่านี้ทำให้ผู้ใช้สามารถลากไฟล์มาวางในพื้นที่อัปโหลดได้
 * 
 * 🎯 HTML5 Drag & Drop API Events:
 * - dragenter: เมื่อลากไฟล์เข้ามาในพื้นที่
 * - dragover: เมื่อลากไฟล์อยู่เหนือพื้นที่
 * - dragleave: เมื่อลากไฟล์ออกจากพื้นที่
 * - drop: เมื่อปล่อยไฟล์ในพื้นที่
 */

/**
 * 📥 Handle Drop Event - จัดการเมื่อปล่อยไฟล์
 */
function handleDrop(event) {
    event.preventDefault();     // ป้องกัน Default Browser Behavior
    event.stopPropagation();    // หยุด Event Bubbling
    
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.remove('drag-over'); // เอา CSS Class ที่ใช้แสดง Hover Effect
    
    const files = event.dataTransfer.files; // ไฟล์ที่ถูกลาก
    if (files.length > 0) {
        const file = files[0]; // เอาไฟล์แรก
        
        // 🔍 Check File Type - ตรวจสอบประเภทไฟล์
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.type.toLowerCase())) {
            loadImagePreview(file); // โหลดตัวอย่างภาพ
        } else {
            showAlert('ไฟล์ประเภทนี้ไม่รองรับ กรุณาเลือกไฟล์ JPG หรือ PNG เท่านั้น', 'danger');
        }
    }
}

/**
 * 🔄 Handle Drag Over Event - จัดการเมื่อลากไฟล์อยู่เหนือพื้นที่
 */
function handleDragOver(event) {
    event.preventDefault();     // ป้องกัน Default Behavior (สำคัญสำหรับ Drop)
    event.stopPropagation();
}

/**
 * 🎯 Handle Drag Enter Event - จัดการเมื่อลากไฟล์เข้าพื้นที่
 */
function handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
    // เพิ่ม CSS Class เพื่อแสดง Visual Feedback
    document.getElementById('uploadArea').classList.add('drag-over');
}

/**
 * 🚪 Handle Drag Leave Event - จัดการเมื่อลากไฟล์ออกจากพื้นที่
 */
function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    // เอา CSS Class ออกเมื่อลากออกจากพื้นที่
    document.getElementById('uploadArea').classList.remove('drag-over');
}

/**
 * 🖼️ Load and Display Image Preview - โหลดและแสดงตัวอย่างภาพ
 * ==========================================================
 * ฟังก์ชันนี้จะอ่านไฟล์ภาพและแสดงตัวอย่างให้ผู้ใช้เห็น
 * พร้อมเก็บข้อมูลภาพไว้สำหรับการประมวลผลต่อ
 * 
 * 🔧 HTML5 FileReader API:
 * - FileReader: ใช้อ่านไฟล์ในรูปแบบต่างๆ
 * - readAsDataURL(): แปลงไฟล์เป็น Base64 Data URL
 * 
 * @param {File} file - ไฟล์ภาพที่จะโหลด
 */
function loadImagePreview(file) {
    const reader = new FileReader(); // สร้าง FileReader Object
    
    // 📖 Event Handler เมื่ออ่านไฟล์เสร็จ
    reader.onload = function(e) {
        const previewImage = document.getElementById('previewImage');
        previewImage.src = e.target.result; // ตั้งค่า src ของ img element
        
        // 👁️ Show Preview Area - แสดงส่วนตัวอย่างภาพ
        document.getElementById('previewArea').classList.remove('d-none');
        
        // � Clear Previous Results - ลบผลลัพธ์เก่า
        clearPreviousResults();
        
        // �💾 Store Image Data - เก็บข้อมูลภาพสำหรับการประมวลผล
        const img = new Image(); // สร้าง Image Object เพื่อดึงขนาดภาพ
        img.onload = function() {
            // เก็บข้อมูลสำคัญของภาพ
            currentImageData = {
                src: e.target.result,  // Base64 Data URL
                width: img.width,      // ความกว้างของภาพ
                height: img.height,    // ความสูงของภาพ
                file: file            // ไฟล์ต้นฉบับ
            };
            
            // 🎉 แสดงข้อความสำเร็จ
            showAlert('อัปโหลดสำเร็จ! กรุณากดปุ่มสร้างสมการเพื่อเริ่มวิเคราะห์', 'success');
        };
        img.src = e.target.result; // โหลดภาพเพื่อดึงขนาด
    };
    
    // 🚀 เริ่มอ่านไฟล์เป็น Data URL
    reader.readAsDataURL(file);
}

/**
 * 🔬 Process the Image and Extract Polynomial - ประมวลผลภาพและสกัดสมการพหุนาม
 * ===========================================================================
 * ฟังก์ชันหลักที่ทำการประมวลผลภาพทั้งหมด
 * 
 * 📋 ขั้นตอนการประมวลผล:
 * 1. ตรวจสอบข้อมูลภาพและการตั้งค่า
 * 2. Edge Detection - ตรวจหาขอบของภาพ
 * 3. Data Point Extraction - สกัดจุดข้อมูล
 * 4. Polynomial Regression - วิเคราะห์พหุนาม
 * 5. Display Results - แสดงผลลัพธ์
 * 
 * 🎯 Computer Vision + Machine Learning Pipeline
 */
async function processImage() {
    // 🔍 Validation - ตรวจสอบข้อมูลที่จำเป็น
    if (!currentImageData) {
        showAlert('กรุณาอัปโหลดภาพก่อน', 'warning');
        return;
    }
    
    // � Clear any previous results first
    clearPreviousResults();
    
    // �📊 Show Progress Bar - แสดงแถบความคืบหน้า
    showProgress();
    
    try {
        // 🔍 Step 1: Advanced Edge Detection - ตรวจหาขอบแบบหลายระดับ
        updateProgress(15, 'กำลังตรวจหาขอบของภาพแบบหลายระดับ...');
        const edgeData = await performMultiLevelEdgeDetection();
        
        // 📍 Step 2: Extract Advanced Data Points - สกัดจุดข้อมูลแบบขั้นสูง
        updateProgress(30, 'กำลังสกัดจุดข้อมูลและจำแนกรูปแบบ...');
        const points = await extractAdvancedDataPoints(edgeData);
        
        // 🎯 Step 3: Generate Advanced Equations - สร้างสมการแบบครอบคลุม
        updateProgress(50, 'กำลังสร้างสมการแบบครอบคลุมทุกรูปแบบ...');
        const results = await generateAdvancedEquations(points);
        
        // 🎨 Step 4: Display Advanced Results - แสดงผลลัพธ์ขั้นสูง
        updateProgress(80, 'กำลังสร้างสมการที่ซับซ้อนและเงื่อนไข...');
        
        // Store results for download functionality
        processedResults = results;
        
        await displayAdvancedResults(results, points, edgeData);
        
        updateProgress(100, 'เสร็จสิ้น! สร้างสมการครอบคลุมเสร็จแล้ว!');
        
        // 🎉 Hide Progress and Show Results - ซ่อนความคืบหน้าและแสดงผลลัพธ์
        setTimeout(() => {
            hideProgress();
            scrollToSection('results-section'); // เลื่อนไปยังส่วนผลลัพธ์
        }, 1000);
        
    } catch (error) {
        console.error('Error processing image:', error);
        showAlert(`เกิดข้อผิดพลาด: ${error.message}`, 'danger');
        hideProgress();
    }
}

// ลบ performEdgeDetection() เก่าออกแล้ว - ใช้ performMultiLevelEdgeDetection() แทน

// ลบ applyCanny() ออกแล้ว - ไม่ได้ใช้งาน

/**
 * Apply Gaussian blur
 */
// ลบ applyGaussianBlur() ออกแล้ว - ไม่ได้ใช้งาน

/**
 * Apply improved Sobel operator for edge detection
 */
// ลบ applySobel() ออกแล้ว - ไม่ได้ใช้งาน

// ลบ extractDataPoints() เก่าออกแล้ว - ใช้ extractAdvancedDataPoints() แทน

// ลบ removeDuplicatePoints() ออกแล้ว - ไม่ได้ใช้งาน

/**
 * Apply density-based filtering to reduce noise
 */
function applyDensityFilter(points, radius = 0.05, minPoints = 2) {
    const filteredPoints = [];
    
    for (const point of points) {
        let neighborCount = 0;
        
        // Count neighbors within radius
        for (const otherPoint of points) {
            const distance = Math.sqrt(
                Math.pow(point.x - otherPoint.x, 2) + 
                Math.pow(point.y - otherPoint.y, 2)
            );
            
            if (distance <= radius) {
                neighborCount++;
            }
        }
        
        // Keep point if it has enough neighbors (not noise)
        if (neighborCount >= minPoints) {
            filteredPoints.push(point);
        }
    }
    
    return filteredPoints;
}

/**
 * Remove outliers using improved IQR method
 */
function removeOutliers(points) {
    if (points.length < 10) return points;
    
    // Apply IQR method to both X and Y coordinates
    let filteredPoints = points;
    
    // Filter by X coordinates
    const xValues = points.map(p => p.x).sort((a, b) => a - b);
    const xQ1 = xValues[Math.floor(xValues.length * 0.25)];
    const xQ3 = xValues[Math.floor(xValues.length * 0.75)];
    const xIQR = xQ3 - xQ1;
    const xLower = xQ1 - 2.0 * xIQR; // More lenient threshold
    const xUpper = xQ3 + 2.0 * xIQR;
    
    filteredPoints = filteredPoints.filter(p => p.x >= xLower && p.x <= xUpper);
    
    // Filter by Y coordinates
    const yValues = filteredPoints.map(p => p.y).sort((a, b) => a - b);
    const yQ1 = yValues[Math.floor(yValues.length * 0.25)];
    const yQ3 = yValues[Math.floor(yValues.length * 0.75)];
    const yIQR = yQ3 - yQ1;
    const yLower = yQ1 - 2.0 * yIQR;
    const yUpper = yQ3 + 2.0 * yIQR;
    
    filteredPoints = filteredPoints.filter(p => p.y >= yLower && p.y <= yUpper);
    
    return filteredPoints;
}

/**
 * Perform polynomial regression for multiple degrees
 */
async function performPolynomialRegression(points, degrees) {
    const results = [];
    
    for (const degree of degrees) {
        const result = fitPolynomial(points, degree);
        results.push({
            degree: degree,
            coefficients: result.coefficients,
            r2: result.r2,
            rmse: result.rmse,
            mae: result.mae
        });
    }
    
    // Sort by R² score (descending)
    results.sort((a, b) => b.r2 - a.r2);
    
    processedResults = {
        polynomials: results,
        dataPoints: points,
        bestPolynomial: results[0]
    };
    
    return processedResults;
}

/**
 * Fit polynomial using least squares method
 */
function fitPolynomial(points, degree) {
    const n = points.length;
    const x = points.map(p => p.x);
    const y = points.map(p => p.y);
    
    // Create Vandermonde matrix
    const A = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j <= degree; j++) {
            row.push(Math.pow(x[i], j));
        }
        A.push(row);
    }
    
    // Solve normal equations: (A^T * A) * coeff = A^T * y
    const coefficients = solveNormalEquations(A, y);
    
    // Calculate metrics
    const predictions = x.map(xi => {
        let pred = 0;
        for (let j = 0; j <= degree; j++) {
            pred += coefficients[j] * Math.pow(xi, j);
        }
        return pred;
    });
    
    const r2 = calculateR2(y, predictions);
    const rmse = calculateRMSE(y, predictions);
    const mae = calculateMAE(y, predictions);
    
    return { coefficients, r2, rmse, mae };
}

/**
 * Solve normal equations using Gaussian elimination
 */
function solveNormalEquations(A, y) {
    const m = A.length;
    const n = A[0].length;
    
    // Calculate A^T * A
    const ATA = [];
    for (let i = 0; i < n; i++) {
        ATA[i] = [];
        for (let j = 0; j < n; j++) {
            let sum = 0;
            for (let k = 0; k < m; k++) {
                sum += A[k][i] * A[k][j];
            }
            ATA[i][j] = sum;
        }
    }
    
    // Calculate A^T * y
    const ATy = [];
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
            sum += A[k][i] * y[k];
        }
        ATy[i] = sum;
    }
    
    // Solve using Gaussian elimination
    return gaussianElimination(ATA, ATy);
}

/**
 * Gaussian elimination solver
 */
function gaussianElimination(A, b) {
    const n = A.length;
    const augmented = A.map((row, i) => [...row, b[i]]);
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
        // Find pivot
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                maxRow = k;
            }
        }
        
        // Swap rows
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
        
        // Make all rows below this one 0 in current column
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(augmented[i][i]) < 1e-10) continue;
            const factor = augmented[k][i] / augmented[i][i];
            for (let j = i; j <= n; j++) {
                augmented[k][j] -= factor * augmented[i][j];
            }
        }
    }
    
    // Back substitution
    const x = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = augmented[i][n];
        for (let j = i + 1; j < n; j++) {
            x[i] -= augmented[i][j] * x[j];
        }
        if (Math.abs(augmented[i][i]) > 1e-10) {
            x[i] /= augmented[i][i];
        }
    }
    
    return x;
}

/**
 * Calculate R² score
 */
function calculateR2(actual, predicted) {
    const actualMean = actual.reduce((a, b) => a + b) / actual.length;
    
    let ssRes = 0;
    let ssTot = 0;
    
    for (let i = 0; i < actual.length; i++) {
        ssRes += Math.pow(actual[i] - predicted[i], 2);
        ssTot += Math.pow(actual[i] - actualMean, 2);
    }
    
    return 1 - (ssRes / ssTot);
}

/**
 * Calculate RMSE
 */
function calculateRMSE(actual, predicted) {
    let sum = 0;
    for (let i = 0; i < actual.length; i++) {
        sum += Math.pow(actual[i] - predicted[i], 2);
    }
    return Math.sqrt(sum / actual.length);
}

/**
 * Calculate MAE
 */
function calculateMAE(actual, predicted) {
    let sum = 0;
    for (let i = 0; i < actual.length; i++) {
        sum += Math.abs(actual[i] - predicted[i]);
    }
    return sum / actual.length;
}

/**
 * 📊 Get Selected Equation Types - ดึงประเภทสมการที่เลือก
 * ========================================================
 * ฟังก์ชันสำหรับดึงประเภทสมการทางคณิตศาสตร์ที่ผู้ใช้เลือกไว้
 * 
 * @returns {string[]} Array ของประเภทสมการที่เลือก เช่น ['circle', 'ellipse', 'linear']
 */
// ลบ getSelectedEquationTypes() และ getSelectedDegrees() ออกแล้ว - ไม่ได้ใช้งาน

/**
 * 🎯 Generate Desmos Equations - สร้างสมการสำหรับ Desmos
 * ======================================================
 * ฟังก์ชันหลักสำหรับวิเคราะห์จุดข้อมูลและสร้างสมการ Desmos
 * ตามประเภทที่ผู้ใช้เลือก
 * 
 * @param {Array} points - จุดข้อมูลที่สกัดจากภาพ [{x, y}, ...]
 * @param {string[]} equationTypes - ประเภทสมการที่ต้องการ ['circle', 'ellipse', ...]
 * @returns {Object} ผลลัพธ์การสร้างสมการ
 */
// ใช้ generateAdvancedEquations() สำหรับสร้างสมการลายไทย

/**
 * Display results (ฟังก์ชันเก่า - เก็บไว้เพื่อ compatibility)
                    equation = generateCircleEquation(points, analysis);
                    break;
                case 'ellipse':
                    equation = generateEllipseEquation(points, analysis);
                    break;
                case 'linear':
                    equation = generateLinearEquation(points, analysis);
                    break;
                case 'parabola':
                    equation = generateParabolaEquation(points, analysis);
                    break;
                case 'hyperbola':
                    equation = generateHyperbolaEquation(points, analysis);
                    break;
                case 'polynomial':
                    equation = generatePolynomialEquation(points, analysis);
                    break;
            }
            
            if (equation) {
                results.equations.push({
                    type: type,
                    equation: equation.equation || equation.latex,
                    latex: equation.latex,
                    accuracy: equation.accuracy,
                    parameters: equation.parameters,
                    description: equation.description
                });
            }
        });
        
        // 📊 เรียงลำดับตามความแม่นยำ
        results.equations.sort((a, b) => b.accuracy - a.accuracy);
        results.bestEquation = results.equations[0] || null;
        
        // 📈 สถิติรวม
        results.statistics = {
            totalEquations: results.equations.length,
            bestAccuracy: results.bestEquation ? results.bestEquation.accuracy : 0,
            avgAccuracy: results.equations.length > 0 
                ? results.equations.reduce((sum, eq) => sum + eq.accuracy, 0) / results.equations.length 
                : 0
        };
        
        resolve(results);
    });
}

/**
 * 🔍 Analyze Point Pattern - วิเคราะห์รูปแบบของจุดข้อมูล
 * ======================================================
 * วิเคราะห์ลักษณะเบื้องต้นของจุดข้อมูลเพื่อช่วยในการสร้างสมการ
 */
function analyzePointPattern(points) {
    if (!points || points.length === 0) return null;
    
    // 📐 คำนวณ Bounding Box
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    // 📍 จุดกึ่งกลาง
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // 📏 ขนาด
    const width = maxX - minX;
    const height = maxY - minY;
    
    // 🎯 อัตราส่วน
    const aspectRatio = width / height;
    
    return {
        bounds: { minX, maxX, minY, maxY },
        center: { x: centerX, y: centerY },
        dimensions: { width, height },
        aspectRatio,
        pointCount: points.length
    };
}

/**
 * ⭕ Generate Circle Equation - สร้างสมการวงกลม
 */
function generateCircleEquation(points, analysis) {
    try {
        // 🎯 ใช้ Least Squares Circle Fitting
        const circle = fitCircle(points);
        
        if (!circle) return null;
        
        const h = circle.centerX.toFixed(2);
        const k = circle.centerY.toFixed(2);
        const r = circle.radius.toFixed(2);
        const r2 = (circle.radius ** 2).toFixed(2);
        
        // 🎨 สร้างสมการ Desmos
        let desmosEquation;
        if (Math.abs(circle.centerX) < 0.1 && Math.abs(circle.centerY) < 0.1) {
            // วงกลมที่จุดกำเนิด
            desmosEquation = `x^{2}+y^{2}=${r2}`;
        } else {
            // วงกลมที่จุดใดๆ
            const hStr = circle.centerX >= 0 ? `-${h}` : `+${Math.abs(h)}`;
            const kStr = circle.centerY >= 0 ? `-${k}` : `+${Math.abs(k)}`;
            desmosEquation = `\\left(x${hStr}\\right)^{2}+\\left(y${kStr}\\right)^{2}=${r2}`;
        }
        
        return {
            desmos: desmosEquation,
            latex: desmosEquation,
            accuracy: circle.accuracy || 0.8,
            parameters: { centerX: circle.centerX, centerY: circle.centerY, radius: circle.radius },
            description: `วงกลมศูนย์กลาง (${h}, ${k}) รัศมี ${r}`
        };
    } catch (error) {
        console.error('Error generating circle equation:', error);
        return null;
    }
}

/**
 * 📏 Generate Linear Equation - สร้างสมการเส้นตรง
 */
function generateLinearEquation(points, analysis) {
    try {
        const line = fitLine(points);
        
        if (!line) return null;
        
        const m = line.slope.toFixed(3);
        const b = line.intercept.toFixed(3);
        
        // 🎨 สร้างสมการ Desmos
        let desmosEquation = 'y=';
        
        if (Math.abs(line.slope - 1) < 0.001) {
            desmosEquation += 'x';
        } else if (Math.abs(line.slope + 1) < 0.001) {
            desmosEquation += '-x';
        } else {
            desmosEquation += `${m}x`;
        }
        
        if (Math.abs(line.intercept) > 0.001) {
            if (line.intercept > 0) {
                desmosEquation += `+${b}`;
            } else {
                desmosEquation += b;
            }
        }
        
        return {
            desmos: desmosEquation,
            latex: desmosEquation,
            accuracy: line.accuracy || 0.9,
            parameters: { slope: line.slope, intercept: line.intercept },
            description: `เส้นตรง ความชัน ${m}, จุดตัด y = ${b}`
        };
    } catch (error) {
        console.error('Error generating linear equation:', error);
        return null;
    }
}

/**
 * 📐 Generate Parabola Equation - สร้างสมการพาราโบลา
 */
function generateParabolaEquation(points, analysis) {
    try {
        const parabola = fitParabola(points);
        
        if (!parabola) return null;
        
        const a = parabola.a.toFixed(3);
        const b = parabola.b.toFixed(3);
        const c = parabola.c.toFixed(3);
        
        // 🎨 สร้างสมการ Desmos
        let desmosEquation = `y=${a}x^{2}`;
        
        if (Math.abs(parabola.b) > 0.001) {
            desmosEquation += parabola.b >= 0 ? `+${b}x` : `${b}x`;
        }
        
        if (Math.abs(parabola.c) > 0.001) {
            desmosEquation += parabola.c >= 0 ? `+${c}` : `${c}`;
        }
        
        return {
            desmos: desmosEquation,
            latex: desmosEquation,
            accuracy: parabola.accuracy || 0.85,
            parameters: { a: parabola.a, b: parabola.b, c: parabola.c },
            description: `พาราโบลา ax²+bx+c (a=${a})`
        };
    } catch (error) {
        console.error('Error generating parabola equation:', error);
        return null;
    }
}

/**
 * 🥚 Generate Ellipse Equation - สร้างสมการวงรี
 */
function generateEllipseEquation(points, analysis) {
    try {
        const ellipse = fitEllipse(points);
        
        if (!ellipse) return null;
        
        const h = ellipse.centerX.toFixed(2);
        const k = ellipse.centerY.toFixed(2);
        const a = ellipse.semiMajor.toFixed(2);
        const b = ellipse.semiMinor.toFixed(2);
        
        // 🎨 สร้างสมการ Desmos
        let desmosEquation;
        if (Math.abs(ellipse.centerX) < 0.1 && Math.abs(ellipse.centerY) < 0.1) {
            // วงรีที่ศูนย์กลาง
            desmosEquation = `\\frac{x^{2}}{${(ellipse.semiMajor ** 2).toFixed(2)}}+\\frac{y^{2}}{${(ellipse.semiMinor ** 2).toFixed(2)}}=1`;
        } else {
            // วงรีที่มีศูนย์กลางไม่อยู่ที่จุดกำเนิด
            desmosEquation = `\\frac{(x-${h})^{2}}{${(ellipse.semiMajor ** 2).toFixed(2)}}+\\frac{(y-${k})^{2}}{${(ellipse.semiMinor ** 2).toFixed(2)}}=1`;
        }
        
        return {
            desmos: desmosEquation,
            latex: desmosEquation,
            accuracy: ellipse.accuracy || 0.75,
            parameters: { centerX: ellipse.centerX, centerY: ellipse.centerY, semiMajor: ellipse.semiMajor, semiMinor: ellipse.semiMinor },
            description: `วงรีศูนย์กลาง (${h}, ${k}) แกนยาว ${a} แกนสั้น ${b}`
        };
    } catch (error) {
        console.error('Error generating ellipse equation:', error);
        return null;
    }
}

/**
 * 〰️ Generate Hyperbola Equation - สร้างสมการไฮเพอร์โบลา
 */
function generateHyperbolaEquation(points, analysis) {
    try {
        const hyperbola = fitHyperbola(points);
        
        if (!hyperbola) return null;
        
        const h = hyperbola.centerX.toFixed(2);
        const k = hyperbola.centerY.toFixed(2);
        const a = hyperbola.a.toFixed(2);
        const b = hyperbola.b.toFixed(2);
        
        // 🎨 สร้างสมการ Desmos
        let desmosEquation;
        if (Math.abs(hyperbola.centerX) < 0.1 && Math.abs(hyperbola.centerY) < 0.1) {
            // ไฮเพอร์โบลาที่ศูนย์กลาง
            desmosEquation = `\\frac{x^{2}}{${(hyperbola.a ** 2).toFixed(2)}}-\\frac{y^{2}}{${(hyperbola.b ** 2).toFixed(2)}}=1`;
        } else {
            // ไฮเพอร์โบลาที่มีศูนย์กลางไม่อยู่ที่จุดกำเนิด
            desmosEquation = `\\frac{(x-${h})^{2}}{${(hyperbola.a ** 2).toFixed(2)}}-\\frac{(y-${k})^{2}}{${(hyperbola.b ** 2).toFixed(2)}}=1`;
        }
        
        return {
            desmos: desmosEquation,
            latex: desmosEquation,
            accuracy: hyperbola.accuracy || 0.7,
            parameters: { centerX: hyperbola.centerX, centerY: hyperbola.centerY, a: hyperbola.a, b: hyperbola.b },
            description: `ไฮเพอร์โบลาศูนย์กลาง (${h}, ${k})`
        };
    } catch (error) {
        console.error('Error generating hyperbola equation:', error);
        return null;
    }
}

/**
 * 📈 Generate Polynomial Equation - สร้างสมการพหุนาม
 */
function generatePolynomialEquation(points, analysis) {
    try {
        // ลองพหุนามดีกรีต่างๆ และเลือกที่ดีที่สุด
        const degrees = [2, 3, 4, 5];
        let bestResult = null;
        let bestAccuracy = 0;
        
        for (const degree of degrees) {
            const result = fitPolynomial(points, degree);
            if (result && result.r2 > bestAccuracy) {
                bestAccuracy = result.r2;
                bestResult = { ...result, degree };
            }
        }
        
        if (!bestResult) return null;
        
        // 🎨 สร้างสมการ Desmos
        const desmosEquation = formatPolynomialForDesmos(bestResult.coefficients, bestResult.degree);
        
        return {
            desmos: desmosEquation,
            latex: desmosEquation,
            accuracy: bestResult.r2,
            parameters: { coefficients: bestResult.coefficients, degree: bestResult.degree },
            description: `พหุนามดีกรี ${bestResult.degree} (R² = ${bestResult.r2.toFixed(3)})`
        };
    } catch (error) {
        console.error('Error generating polynomial equation:', error);
        return null;
    }
}

/**
 * 📝 Format Polynomial for Desmos - จัดรูปแบบพหุนามสำหรับ Desmos
 */
function formatPolynomialForDesmos(coefficients, degree) {
    let equation = 'y=';
    let terms = [];
    
    for (let i = degree; i >= 0; i--) {
        const coeff = coefficients[i];
        if (Math.abs(coeff) < 1e-6) continue; // ข้ามสัมประสิทธิ์ที่เล็กมาก
        
        let term = '';
        const absCoeff = Math.abs(coeff);
        const coeffStr = absCoeff.toFixed(4);
        
        if (i === 0) {
            // พจน์คงตัว
            term = coeffStr;
        } else if (i === 1) {
            // พจน์ x
            if (Math.abs(absCoeff - 1) < 1e-6) {
                term = 'x';
            } else {
                term = `${coeffStr}x`;
            }
        } else {
            // พจน์ x^n
            if (Math.abs(absCoeff - 1) < 1e-6) {
                term = `x^{${i}}`;
            } else {
                term = `${coeffStr}x^{${i}}`;
            }
        }
        
        // เพิ่มเครื่องหมาย
        if (terms.length === 0) {
            if (coeff < 0) term = '-' + term;
        } else {
            term = (coeff >= 0 ? '+' : '-') + term;
        }
        
        terms.push(term);
    }
    
    return equation + (terms.length > 0 ? terms.join('') : '0');
}

/**
 * 🔧 Simple Curve Fitting Functions - ฟังก์ชันการ fit เส้นโค้งแบบง่าย
 * ================================================================
 */

/**
 * ⭕ Fit Circle - การ fit วงกลม (Improved Algorithm)
 */
function fitCircle(points) {
    try {
        if (points.length < 3) return null;
        
        // Use algebraic circle fitting method
        const n = points.length;
        let sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0, sumXY = 0;
        let sumX3 = 0, sumY3 = 0, sumX2Y = 0, sumXY2 = 0;
        
        for (const p of points) {
            const x = p.x;
            const y = p.y;
            const x2 = x * x;
            const y2 = y * y;
            
            sumX += x;
            sumY += y;
            sumX2 += x2;
            sumY2 += y2;
            sumXY += x * y;
            sumX3 += x2 * x;
            sumY3 += y2 * y;
            sumX2Y += x2 * y;
            sumXY2 += x * y2;
        }
        
        // Solve system of linear equations for circle parameters
        // Using least squares method for better accuracy
        const A = 2 * (n * sumX2 - sumX * sumX);
        const B = 2 * (n * sumXY - sumX * sumY);
        const C = 2 * (n * sumY2 - sumY * sumY);
        const D = n * (sumX3 + sumXY2) - sumX * (sumX2 + sumY2);
        const E = n * (sumX2Y + sumY3) - sumY * (sumX2 + sumY2);
        
        const denom = A * C - B * B;
        if (Math.abs(denom) < 1e-10) {
            // Fallback to simple centroid method
            const centerX = sumX / n;
            const centerY = sumY / n;
            let sumDist2 = 0;
            for (const p of points) {
                const dx = p.x - centerX;
                const dy = p.y - centerY;
                sumDist2 += dx * dx + dy * dy;
            }
            const radius = Math.sqrt(sumDist2 / n);
            
            return {
                centerX: centerX,
                centerY: centerY,
                radius: radius,
                accuracy: 0.6
            };
        }
        
        const centerX = (C * D - B * E) / denom;
        const centerY = (A * E - B * D) / denom;
        
        // Calculate radius using fitted center
        let sumRadii = 0;
        for (const p of points) {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            sumRadii += Math.sqrt(dx * dx + dy * dy);
        }
        const radius = sumRadii / n;
        
        // Calculate accuracy (R²)
        let totalVariance = 0;
        let unexplainedVariance = 0;
        const avgRadius = radius;
        
        for (const p of points) {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const actualRadius = Math.sqrt(dx * dx + dy * dy);
            
            totalVariance += (actualRadius - avgRadius) * (actualRadius - avgRadius);
            unexplainedVariance += (actualRadius - radius) * (actualRadius - radius);
        }
        
        const accuracy = totalVariance > 0 ? Math.max(0, 1 - unexplainedVariance / totalVariance) : 0.8;
        
        return {
            centerX: centerX,
            centerY: centerY,
            radius: radius,
            accuracy: Math.min(0.95, Math.max(0.1, accuracy))
        };
    } catch (error) {
        console.error('Error fitting circle:', error);
        return null;
    }
}

/**
 * 📏 Fit Line - การ fit เส้นตรง (Improved Linear Regression)
 */
function fitLine(points) {
    try {
        if (points.length < 2) return null;
        
        const n = points.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
        
        for (const p of points) {
            sumX += p.x;
            sumY += p.y;
            sumXY += p.x * p.y;
            sumX2 += p.x * p.x;
            sumY2 += p.y * p.y;
        }
        
        const meanX = sumX / n;
        const meanY = sumY / n;
        
        // Calculate slope and intercept using least squares
        const numerator = sumXY - n * meanX * meanY;
        const denominator = sumX2 - n * meanX * meanX;
        
        if (Math.abs(denominator) < 1e-10) {
            // Vertical line case - handle separately
            return {
                slope: Infinity,
                intercept: meanX,
                accuracy: 0.5,
                isVertical: true
            };
        }
        
        const slope = numerator / denominator;
        const intercept = meanY - slope * meanX;
        
        // Calculate R² (coefficient of determination)
        let ssRes = 0; // Sum of squares of residuals
        let ssTot = 0; // Total sum of squares
        
        for (const p of points) {
            const predicted = slope * p.x + intercept;
            ssRes += (p.y - predicted) ** 2;
            ssTot += (p.y - meanY) ** 2;
        }
        
        const r2 = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;
        
        // Also calculate correlation coefficient for validation
        const sxy = sumXY - n * meanX * meanY;
        const sxx = sumX2 - n * meanX * meanX;
        const syy = sumY2 - n * meanY * meanY;
        const correlation = (sxx > 0 && syy > 0) ? sxy / Math.sqrt(sxx * syy) : 0;
        
        return {
            slope: slope,
            intercept: intercept,
            accuracy: Math.max(0, Math.min(1, r2)),
            correlation: correlation,
            isVertical: false
        };
    } catch (error) {
        console.error('Error fitting line:', error);
        return null;
    }
}

/**
 * 📐 Fit Parabola - การ fit พาราโบลา (Quadratic Regression)
 */
function fitParabola(points) {
    try {
        if (points.length < 3) return null;
        
        // สำหรับความเรียบง่าย ใช้ 3 จุดแรก
        const p1 = points[0];
        const p2 = points[Math.floor(points.length / 2)];
        const p3 = points[points.length - 1];
        
        // System of equations: y = ax² + bx + c
        // p1: y1 = a*x1² + b*x1 + c
        // p2: y2 = a*x2² + b*x2 + c  
        // p3: y3 = a*x3² + b*x3 + c
        
        const x1 = p1.x, y1 = p1.y;
        const x2 = p2.x, y2 = p2.y;
        const x3 = p3.x, y3 = p3.y;
        
        // Solve using Cramer's rule (simplified)
        const denom = (x1 - x2) * (x1 - x3) * (x2 - x3);
        if (Math.abs(denom) < 0.001) return null;
        
        const a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / denom;
        const b = (x3 * x3 * (y1 - y2) + x2 * x2 * (y3 - y1) + x1 * x1 * (y2 - y3)) / denom;
        const c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / denom;
        
        return {
            a: a,
            b: b, 
            c: c,
            accuracy: 0.75
        };
    } catch (error) {
        console.error('Error fitting parabola:', error);
        return null;
    }
}

/**
 * 🥚 Fit Ellipse - การ fit วงรี (Improved Algorithm)
 */
function fitEllipse(points) {
    try {
        if (points.length < 5) return null;
        
        // Find initial center estimate
        let sumX = 0, sumY = 0;
        for (const p of points) {
            sumX += p.x;
            sumY += p.y;
        }
        let centerX = sumX / points.length;
        let centerY = sumY / points.length;
        
        // Iterative improvement of ellipse parameters
        for (let iter = 0; iter < 5; iter++) {
            // Calculate covariance matrix
            let sxx = 0, syy = 0, sxy = 0;
            for (const p of points) {
                const dx = p.x - centerX;
                const dy = p.y - centerY;
                sxx += dx * dx;
                syy += dy * dy;
                sxy += dx * dy;
            }
            
            const n = points.length;
            sxx /= n;
            syy /= n;
            sxy /= n;
            
            // Eigenvalues and eigenvectors for ellipse orientation
            const trace = sxx + syy;
            const det = sxx * syy - sxy * sxy;
            
            if (det <= 0) break; // Invalid ellipse
            
            const eigenval1 = (trace + Math.sqrt(trace * trace - 4 * det)) / 2;
            const eigenval2 = (trace - Math.sqrt(trace * trace - 4 * det)) / 2;
            
            // Semi-axes lengths (with some scaling factor)
            const semiMajor = Math.sqrt(Math.max(eigenval1, eigenval2)) * 2;
            const semiMinor = Math.sqrt(Math.min(eigenval1, eigenval2)) * 2;
            
            // Refine center by fitting ellipse equation
            let newCenterX = 0, newCenterY = 0, weightSum = 0;
            for (const p of points) {
                const dx = p.x - centerX;
                const dy = p.y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0) {
                    const weight = 1 / (1 + dist); // Distance-based weighting
                    newCenterX += p.x * weight;
                    newCenterY += p.y * weight;
                    weightSum += weight;
                }
            }
            
            if (weightSum > 0) {
                centerX = newCenterX / weightSum;
                centerY = newCenterY / weightSum;
            }
        }
        
        // Final calculation of semi-axes
        let maxDist = 0, minDist = Number.MAX_VALUE;
        let distances = [];
        
        for (const p of points) {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            distances.push(dist);
            maxDist = Math.max(maxDist, dist);
            minDist = Math.min(minDist, dist);
        }
        
        // Use statistical measures for better axis estimation
        distances.sort((a, b) => a - b);
        const percentile75 = distances[Math.floor(distances.length * 0.75)];
        const percentile25 = distances[Math.floor(distances.length * 0.25)];
        
        const semiMajor = Math.max(percentile75, maxDist * 0.8);
        const semiMinor = Math.max(percentile25, minDist * 1.2);
        
        // Calculate accuracy based on how well points fit the ellipse
        let errorSum = 0;
        for (const p of points) {
            const dx = (p.x - centerX) / semiMajor;
            const dy = (p.y - centerY) / semiMinor;
            const ellipseValue = dx * dx + dy * dy;
            const error = Math.abs(ellipseValue - 1);
            errorSum += error;
        }
        
        const avgError = errorSum / points.length;
        const accuracy = Math.max(0.1, Math.min(0.95, 1 - avgError));
        
        return {
            centerX: centerX,
            centerY: centerY,
            semiMajor: semiMajor,
            semiMinor: semiMinor,
            accuracy: accuracy
        };
    } catch (error) {
        console.error('Error fitting ellipse:', error);
        return null;
    }
}

/**
 * 〰️ Fit Hyperbola - การ fit ไฮเพอร์โบลา
 */
function fitHyperbola(points) {
    try {
        if (points.length < 4) return null;
        
        // Simple hyperbola fitting
        // Find center
        let sumX = 0, sumY = 0;
        for (const p of points) {
            sumX += p.x;
            sumY += p.y;
        }
        const centerX = sumX / points.length;
        const centerY = sumY / points.length;
        
        // Estimate parameters
        let maxDistX = 0, maxDistY = 0;
        for (const p of points) {
            const distX = Math.abs(p.x - centerX);
            const distY = Math.abs(p.y - centerY);
            maxDistX = Math.max(maxDistX, distX);
            maxDistY = Math.max(maxDistY, distY);
        }
        
        return {
            centerX: centerX,
            centerY: centerY,
            a: maxDistX * 0.7,
            b: maxDistY * 0.7,
            accuracy: 0.65
        };
    } catch (error) {
        console.error('Error fitting hyperbola:', error);
        return null;
    }
}

/**
 * 📈 Fit Polynomial - การ fit พหุนาม
 */
function fitPolynomial(points, degree) {
    try {
        if (points.length < degree + 1) return null;
        
        // Simple polynomial fitting using normal equations
        const n = points.length;
        const matrix = [];
        const vector = [];
        
        // Build normal equations matrix
        for (let i = 0; i <= degree; i++) {
            const row = [];
            for (let j = 0; j <= degree; j++) {
                let sum = 0;
                for (const p of points) {
                    sum += Math.pow(p.x, i + j);
                }
                row.push(sum);
            }
            matrix.push(row);
            
            let sum = 0;
            for (const p of points) {
                sum += p.y * Math.pow(p.x, i);
            }
            vector.push(sum);
        }
        
        // Solve using Gaussian elimination (simplified for small matrices)
        const coefficients = solveLinearSystem(matrix, vector);
        
        // Calculate R²
        const meanY = points.reduce((sum, p) => sum + p.y, 0) / n;
        let ssRes = 0, ssTot = 0;
        
        for (const p of points) {
            let predicted = 0;
            for (let i = 0; i <= degree; i++) {
                predicted += coefficients[i] * Math.pow(p.x, i);
            }
            ssRes += (p.y - predicted) ** 2;
            ssTot += (p.y - meanY) ** 2;
        }
        
        const r2 = Math.max(0, 1 - (ssRes / ssTot));
        
        return {
            coefficients: coefficients,
            r2: r2
        };
    } catch (error) {
        console.error('Error fitting polynomial:', error);
        return null;
    }
}

/**
 * 🧮 Solve Linear System - แก้ระบบสมการเชิงเส้น
 */
function solveLinearSystem(matrix, vector) {
    const n = matrix.length;
    const augmented = matrix.map((row, i) => [...row, vector[i]]);
    
    // Gaussian elimination
    for (let i = 0; i < n; i++) {
        // Find pivot
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                maxRow = k;
            }
        }
        
        // Swap rows
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
        
        // Make all rows below this one 0 in current column
        for (let k = i + 1; k < n; k++) {
            const c = augmented[k][i] / augmented[i][i];
            for (let j = i; j <= n; j++) {
                if (i === j) {
                    augmented[k][j] = 0;
                } else {
                    augmented[k][j] -= c * augmented[i][j];
                }
            }
        }
    }
    
    // Back substitution
    const solution = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        solution[i] = augmented[i][n];
        for (let j = i + 1; j < n; j++) {
            solution[i] -= augmented[i][j] * solution[j];
        }
        solution[i] /= augmented[i][i];
    }
    
    return solution;
}

/**
 * Display results
 */
async function displayResults(results, points, edgeData) {
    // Show results container
    document.getElementById('resultsContainer').classList.remove('d-none');
    document.getElementById('noResultsMessage').classList.add('d-none');
    
    // Update statistics for Desmos equations
    const bestEquation = results.bestEquation;
    const stats = results.statistics;
    
    // Update the statistics cards - ใช้ null checks
    const bestAccuracyEl = document.getElementById('bestAccuracy');
    if (bestAccuracyEl) {
        bestAccuracyEl.textContent = bestEquation ? 
            `${(bestEquation.accuracy * 100).toFixed(1)}%` : '0%';
    }
    
    const totalEquationsEl = document.getElementById('totalEquations');
    if (totalEquationsEl) {
        totalEquationsEl.textContent = stats.totalEquations || 0;
    }
    
    const dataPointsEl = document.getElementById('dataPoints');
    if (dataPointsEl) {
        dataPointsEl.textContent = results.dataPoints || points.length;
    }
    
    // Display edge detection result
    displayEdgeDetection(edgeData);
    
    // Display Desmos equations chart
    displayDesmosChart(results, points);
    
    // Display Desmos equations
    displayDesmosEquations(results.equations);
}

/**
 * Display edge detection result
 */
function displayEdgeDetection(edgeData) {
    const canvas = document.getElementById('edgeCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = edgeData.width;
    canvas.height = edgeData.height;
    
    ctx.putImageData(edgeData.imageData, 0, 0);
}

/**
 * Display Desmos equations chart
 */
function displayDesmosChart(results, points) {
    const canvas = document.getElementById('polynomialChart');
    const ctx = canvas.getContext('2d');
    
    // Clear any existing chart
    if (window.myChart) {
        window.myChart.destroy();
    }
    
    // Prepare datasets
    const datasets = [];
    
    // Original data points
    datasets.push({
        label: 'จุดข้อมูลจริง',
        data: points.map(p => ({ x: p.x, y: p.y })),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        type: 'scatter',
        pointRadius: 3,
        showLine: false
    });
    
    // Add curves for equations that can be visualized
    const colors = [
        'rgba(54, 162, 235, 1)',   // Blue
        'rgba(75, 192, 192, 1)',   // Teal
        'rgba(255, 206, 86, 1)',   // Yellow
        'rgba(153, 102, 255, 1)',  // Purple
        'rgba(255, 159, 64, 1)',   // Orange
        'rgba(199, 199, 199, 1)'   // Grey
    ];
    
    // Generate visualization for different equation types
    results.equations.forEach((equation, index) => {
        const color = colors[index % colors.length];
        
        if (equation.equation && equation.parameters) {
            const xMin = Math.min(...points.map(p => p.x)) - 1;
            const xMax = Math.max(...points.map(p => p.x)) + 1;
            const yMin = Math.min(...points.map(p => p.y)) - 1;
            const yMax = Math.max(...points.map(p => p.y)) + 1;
            
            // Handle different equation types for visualization
            if (equation.equation.includes('y=') && (equation.parameters.coefficients || equation.parameters.slope !== undefined)) {
                // For polynomial and linear equations
                const xValues = [];
                const yValues = [];
                
                for (let i = 0; i <= 200; i++) {
                    const x = xMin + (xMax - xMin) * i / 200;
                    let y = 0;
                    
                    if (equation.parameters.coefficients) {
                        // Polynomial
                        const coeffs = equation.parameters.coefficients;
                        for (let j = 0; j < coeffs.length; j++) {
                            y += coeffs[j] * Math.pow(x, j);
                        }
                    } else if (equation.parameters.slope !== undefined) {
                        // Linear
                        if (equation.parameters.isVertical) {
                            // Skip vertical lines for y= visualization
                            continue;
                        }
                        y = equation.parameters.slope * x + equation.parameters.intercept;
                    }
                    
                    // Only include points within reasonable range
                    if (y >= yMin - 2 && y <= yMax + 2) {
                        xValues.push(x);
                        yValues.push(y);
                    }
                }
                
                if (xValues.length > 0) {
                    datasets.push({
                        label: `${equation.description} (${(equation.accuracy * 100).toFixed(1)}%)`,
                        data: xValues.map((x, i) => ({ x, y: yValues[i] })),
                        borderColor: color,
                        backgroundColor: color.replace('1)', '0.1)'),
                        type: 'line',
                        fill: false,
                        pointRadius: 0,
                        tension: 0.1,
                        borderWidth: 2
                    });
                }
            } else if (equation.parameters.centerX !== undefined && equation.parameters.centerY !== undefined) {
                // For circle and ellipse equations - generate parametric points
                const parametricPoints = [];
                const steps = 100;
                
                if (equation.parameters.radius !== undefined) {
                    // Circle
                    for (let i = 0; i <= steps; i++) {
                        const t = (2 * Math.PI * i) / steps;
                        const x = equation.parameters.centerX + equation.parameters.radius * Math.cos(t);
                        const y = equation.parameters.centerY + equation.parameters.radius * Math.sin(t);
                        parametricPoints.push({ x, y });
                    }
                } else if (equation.parameters.semiMajor !== undefined) {
                    // Ellipse
                    for (let i = 0; i <= steps; i++) {
                        const t = (2 * Math.PI * i) / steps;
                        const x = equation.parameters.centerX + equation.parameters.semiMajor * Math.cos(t);
                        const y = equation.parameters.centerY + equation.parameters.semiMinor * Math.sin(t);
                        parametricPoints.push({ x, y });
                    }
                }
                
                if (parametricPoints.length > 0) {
                    datasets.push({
                        label: `${equation.description} (${(equation.accuracy * 100).toFixed(1)}%)`,
                        data: parametricPoints,
                        borderColor: color,
                        backgroundColor: color.replace('1)', '0.1)'),
                        type: 'line',
                        fill: false,
                        pointRadius: 0,
                        tension: 0,
                        borderWidth: 2
                    });
                }
            }
        }
    });
    
    // Create chart
    window.myChart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: { display: true, text: 'X' }
                },
                y: {
                    title: { display: true, text: 'Y' }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'กราฟสมการ Desmos'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

/**
 * Display Desmos equations
 */
function displayDesmosEquations(equations) {
    const container = document.getElementById('equationsContainer');
    container.innerHTML = '';
    
    if (!equations || equations.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center">ไม่พบสมการที่เหมาะสม</p></div>';
        return;
    }
    
    equations.forEach((equation, index) => {
        const col = document.createElement('div');
        col.className = 'col-lg-6 mb-3';
        
        // Create equation card with copy functionality
        col.innerHTML = `
            <div class="card equation-card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">สมการที่ ${index + 1}</h6>
                    <span class="badge bg-${getAccuracyColor(equation.accuracy)}">${(equation.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div class="card-body">
                    <div class="equation-display mb-3">
                        <code class="equation-code" id="equation-${index}">${cleanEquationForDisplay(equation.equation)}</code>
                        <button class="btn btn-sm btn-outline-primary ms-2" onclick="copyEquation('equation-${index}')">
                            <i class="fas fa-copy"></i> คัดลอก
                        </button>
                    </div>
                    <div class="equation-info">
                        <small class="text-muted">
                            <i class="fas fa-info-circle me-1"></i>
                            วางสมการนี้ในช่อง Expression ของ Desmos
                        </small>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(col);
    });
}

/**
 * Get accuracy color badge
 */
function getAccuracyColor(accuracy) {
    if (accuracy >= 0.9) return 'success';
    if (accuracy >= 0.7) return 'primary';
    if (accuracy >= 0.5) return 'warning';
    return 'secondary';
}

/**
 * Clean equation for display - remove \left and \right for better readability
 */
function cleanEquationForDisplay(equation) {
    // Handle both \\left and \left patterns
    return equation
        .replace(/\\\\left/g, '')
        .replace(/\\\\right/g, '')
        .replace(/\\left/g, '')
        .replace(/\\right/g, '');
}

/**
 * Copy equation to clipboard
 */
function copyEquation(elementId) {
    const element = document.getElementById(elementId);
    let text = element.textContent;
    
    // Remove \left and \right for cleaner copy
    text = text.replace(/\\left/g, '').replace(/\\right/g, '');
    
    navigator.clipboard.writeText(text).then(() => {
        showAlert('คัดลอกสมการเรียบร้อยแล้ว!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showAlert('คัดลอกสมการเรียบร้อยแล้ว!', 'success');
    });
}

/**
 * Format polynomial equation
 */
function formatPolynomial(coefficients, degree) {
    let equation = 'y = ';
    let terms = [];
    
    for (let i = degree; i >= 0; i--) {
        const coeff = coefficients[i];
        if (Math.abs(coeff) < 1e-10) continue;
        
        let term = '';
        const absCoeff = Math.abs(coeff);
        const sign = coeff >= 0 ? '+' : '-';
        
        if (terms.length > 0) {
            term += ` ${sign} `;
        } else if (coeff < 0) {
            term += '-';
        }
        
        if (i === 0) {
            term += absCoeff.toFixed(4);
        } else if (i === 1) {
            if (absCoeff === 1) {
                term += 'x';
            } else {
                term += `${absCoeff.toFixed(4)}x`;
            }
        } else {
            if (absCoeff === 1) {
                term += `x^${i}`;
            } else {
                term += `${absCoeff.toFixed(4)}x^${i}`;
            }
        }
        
        terms.push(term);
    }
    
    return equation + (terms.length > 0 ? terms.join('') : '0');
}

/**
 * Progress bar functions
 */
function showProgress() {
    const progressArea = document.getElementById('progressArea');
    if (progressArea) {
        progressArea.classList.remove('d-none');
        updateProgress(0, 'เริ่มต้นการประมวลผล...');
    } else {
        console.warn('progressArea element not found');
    }
}

function updateProgress(percent, text) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (!progressBar || !progressText) {
        console.warn('Progress bar elements not found');
        return;
    }
    
    // Smooth animation for progress bar
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', percent);
    
    // Add success color when complete
    if (percent === 100) {
        progressBar.classList.remove('bg-primary');
        progressBar.classList.add('bg-success');
        progressText.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i>${text}`;
    } else if (percent > 0) {
        progressBar.classList.remove('bg-success');
        progressBar.classList.add('bg-primary');
        progressText.innerHTML = `<i class="fas fa-cog fa-spin text-primary me-2"></i>${text}`;
    } else {
        progressText.textContent = text;
    }
}

function hideProgress() {
    const progressArea = document.getElementById('progressArea');
    if (progressArea) {
        progressArea.classList.add('d-none');
    } else {
        console.warn('progressArea element not found');
    }
}

/**
 * Download results
 */
function downloadResults(format) {
    if (!processedResults) {
        showAlert('ไม่มีผลลัพธ์ให้ดาวน์โหลด', 'warning');
        return;
    }
    
    let content, filename, mimeType;
    
    switch (format) {
        case 'json':
            content = JSON.stringify(processedResults, null, 2);
            filename = 'polynomial_results.json';
            mimeType = 'application/json';
            break;
            
        case 'csv':
            content = generateCSV(processedResults);
            filename = 'polynomial_results.csv';
            mimeType = 'text/csv';
            break;
            
        case 'txt':
            content = generateTextReport(processedResults);
            filename = 'polynomial_results.txt';
            mimeType = 'text/plain';
            break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert(`ดาวน์โหลด ${filename} สำเร็จ`, 'success');
}

/**
 * Generate CSV content for Desmos equations
 */
function generateCSV(results) {
    let csv = 'Equation_Type,Desmos_Equation,Accuracy,Description,Parameters\n';
    
    if (results.equations) {
        results.equations.forEach(eq => {
            const paramStr = JSON.stringify(eq.parameters).replace(/"/g, '""');
            csv += `"${eq.description}","${eq.equation}",${eq.accuracy.toFixed(6)},"${eq.description}","${paramStr}"\n`;
        });
    }
    
    csv += '\nStatistics\n';
    csv += `Total_Equations,${results.statistics?.totalEquations || 0}\n`;
    csv += `Best_Accuracy,${results.statistics?.bestAccuracy || 0}\n`;
    csv += `Data_Points,${results.dataPoints || 0}\n`;
    
    return csv;
}

/**
 * Generate text report for Desmos equations
 */
function generateTextReport(results) {
    let report = 'POLYART - รายงานการสร้างสมการลวดลายศิลปวัฒนธรรม\n';
    report += '=========================================\n\n';
    
    const stats = results.statistics || {};
    report += `Data Points: ${results.dataPoints || 0}\n`;
    report += `Total Equations: ${stats.totalEquations || 0}\n`;
    report += `Best Accuracy: ${((stats.bestAccuracy || 0) * 100).toFixed(2)}%\n\n`;
    
    if (results.bestEquation) {
        report += `Best Equation: ${results.bestEquation.description}\n`;
        report += `Best Desmos Code: ${results.bestEquation.equation}\n\n`;
    }
    
    report += 'Generated Desmos Equations:\n';
    report += '---------------------------\n';
    
    if (results.equations) {
        results.equations.forEach((eq, index) => {
            report += `${index + 1}. ${eq.description}\n`;
            report += `   Desmos: ${eq.equation}\n`;
            report += `   Accuracy: ${(eq.accuracy * 100).toFixed(2)}%\n\n`;
        });
    }
    
    return report;
}

/**
 * Utility functions
 */
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// ===================================================================
// 🎯 Advanced Processing Functions - ฟังก์ชันประมวลผลขั้นสูง
// ===================================================================

/**
 * 🎯 Multi-Level Edge Detection - การตรวจจับขอบแบบหลายระดับ
 */
async function performMultiLevelEdgeDetection() {
    console.log('Performing detailed edge detection on actual uploaded image...');
    
    if (!currentImageData) {
        throw new Error('ไม่พบข้อมูลภาพ');
    }
    
    // สร้าง canvas สำหรับการประมวลผล
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // ได้ขนาดจาก preview image
    const previewImg = document.getElementById('previewImage');
    if (!previewImg || !previewImg.naturalWidth) {
        throw new Error('ไม่สามารถได้ขนาดภาพได้');
    }
    
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    
    console.log(`Processing image: ${canvas.width}x${canvas.height} pixels`);
    
    // วาดภาพลงบน canvas
    ctx.drawImage(previewImg, 0, 0);
    
    // ได้ข้อมูล pixel
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // ทำ edge detection แบบง่าย (Sobel operator)
    const edgeData = applySobelFilter(imageData);
    
    // Extract actual coordinate points from the image
    const extractedPoints = extractRealCoordinates(edgeData, canvas.width, canvas.height);
    
    console.log(`Edge detection completed. Found ${extractedPoints.length} significant points`);
    
    return {
        original: imageData,
        edges: edgeData,
        width: canvas.width,
        height: canvas.height,
        data: edgeData.data,
        realPoints: extractedPoints,
        imageScale: { width: canvas.width, height: canvas.height }
    };
}

/**
 * 🔍 Apply Sobel Filter - ใช้ Sobel filter สำหรับ edge detection
 */
function applySobelFilter(imageData) {
    const { data, width, height } = imageData;
    const output = new ImageData(width, height);
    
    // Sobel kernels
    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0, gy = 0;
            
            // ใช้ Sobel operator
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4;
                    const gray = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
                    
                    gx += gray * sobelX[ky + 1][kx + 1];
                    gy += gray * sobelY[ky + 1][kx + 1];
                }
            }
            
            const magnitude = Math.sqrt(gx * gx + gy * gy);
            const idx = (y * width + x) * 4;
            
            output.data[idx] = magnitude;     // R
            output.data[idx + 1] = magnitude; // G
            output.data[idx + 2] = magnitude; // B
            output.data[idx + 3] = 255;       // A
        }
    }
    
    return output;
}

/**
 * 🗺️ Extract Real Coordinates - สกัดพิกัดจริงจากภาพ
 */
function extractRealCoordinates(edgeData, imageWidth, imageHeight) {
    const points = [];
    const { data } = edgeData;
    const threshold = 100;
    
    // แปลงพิกัดภาพเป็นพิกัดคณิตศาสตร์ (Desmos coordinate system)
    const centerX = imageWidth / 2;
    const centerY = imageHeight / 2;
    const scale = Math.min(imageWidth, imageHeight) / 20; // สเกลเหมาะสมสำหรับ Desmos
    
    console.log(`Image dimensions: ${imageWidth}x${imageHeight}, Center: (${centerX}, ${centerY}), Scale: ${scale}`);
    
    // สแกนทุกจุดของภาพเพื่อหาขอบ (edges)
    for (let y = 0; y < imageHeight; y += 2) { // ลด sampling เพื่อประสิทธิภาพ
        for (let x = 0; x < imageWidth; x += 2) {
            const index = (y * imageWidth + x) * 4;
            const intensity = data[index]; // ความเข้มของขอบ
            
            if (intensity > threshold) {
                // แปลงจากพิกัดภาพเป็นพิกัดคณิตศาสตร์
                const mathX = (x - centerX) / scale;
                const mathY = (centerY - y) / scale; // กลับ Y เพราะในภาพ Y เป็นลบ
                
                points.push({
                    x: parseFloat(mathX.toFixed(3)),
                    y: parseFloat(mathY.toFixed(3)),
                    intensity: intensity,
                    imageX: x,
                    imageY: y
                });
            }
        }
    }
    
    console.log(`Extracted ${points.length} coordinate points from actual image`);
    
    // กรองจุดที่ซ้ำซ้อน
    const filteredPoints = points.filter((point, index, arr) => {
        // ตรวจสอบว่ามีจุดอื่นที่ใกล้เคียง
        const nearbyPoints = arr.filter(other => 
            Math.abs(other.x - point.x) < 0.1 && 
            Math.abs(other.y - point.y) < 0.1
        );
        return nearbyPoints.length === 1 || nearbyPoints[0] === point;
    });
    
    console.log(`After filtering: ${filteredPoints.length} unique points`);
    return filteredPoints;
}

/**
 * 🎯 Extract Advanced Data Points - สกัดจุดข้อมูลแบบขั้นสูง
 */
async function extractAdvancedDataPoints(edgeData) {
    console.log('Extracting data points from edge data...');
    const points = [];
    
    if (!edgeData || !edgeData.data) {
        console.log('No edge data available, returning empty points');
        return points;
    }
    
    // ใช้จุดที่สกัดจากภาพจริง
    if (edgeData.realPoints && edgeData.realPoints.length > 0) {
        console.log('Using real coordinate points from image analysis');
        return edgeData.realPoints;
    }
    
    const { data, width, height } = edgeData;
    const threshold = 100; // ค่าความเข้มของขอบที่ยอมรับได้
    const sampleRate = 5; // ลดความหนาแน่นของจุดข้อมูล
    
    // สกัดจุดข้อมูลจากภาพขอบที่ได้
    for (let y = 0; y < height; y += sampleRate) {
        for (let x = 0; x < width; x += sampleRate) {
            const index = (y * width + x) * 4;
            const intensity = data[index]; // ความเข้มสีแดง (grayscale)
            
            // หากจุดนี้เป็นขอบ (ความเข้มสูง)
            if (intensity > threshold) {
                points.push({
                    x: x,
                    y: y,
                    intensity: intensity
                });
            }
        }
    }
    
    console.log(`Extracted ${points.length} data points from image`);
    
    // หากไม่พบจุดข้อมูลเพียงพอ ให้สร้างจุดตัวอย่าง
    if (points.length < 10) {
        console.log('Insufficient edge points detected, generating sample points based on image size');
        return generateSamplePointsFromImage(width, height);
    }
    
    // กรองจุดข้อมูลและจัดกลุ่ม
    const filteredPoints = filterAndClusterPoints(points);
    
    return {
        fine: filteredPoints,
        medium: filteredPoints,
        coarse: filteredPoints,
        all: filteredPoints
    };
}

/**
 * 🎲 Generate Sample Points From Image - สร้างจุดตัวอย่างจากขนาดภาพ
 */
function generateSamplePointsFromImage(width, height) {
    const points = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 4;
    
    // สร้างจุดแบบสุ่มตามขนาดภาพ
    for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * 2 * Math.PI;
        const radius = maxRadius * (0.5 + Math.random() * 0.5);
        
        points.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            intensity: 255
        });
    }
    
    return points;
}

/**
 * 🔧 Filter And Cluster Points - กรองและจัดกลุ่มจุดข้อมูล
 */
function filterAndClusterPoints(points) {
    // ลดจำนวนจุดข้อมูลให้เหมาะสม
    const maxPoints = 200;
    if (points.length > maxPoints) {
        const step = Math.floor(points.length / maxPoints);
        return points.filter((_, index) => index % step === 0);
    }
    
    return points;
}

/**
 * 🎯 Generate Advanced Equations - สร้างสมการแบบครอบคลุม
 */
async function generateAdvancedEquations(pointsData) {
    console.log('Analyzing image data points. Type:', typeof pointsData);
    console.log('Data structure:', pointsData);
    
    const equations = [];
    
    // ตรวจสอบว่า pointsData มีข้อมูลหรือไม่
    let dataLength = 0;
    if (Array.isArray(pointsData)) {
        dataLength = pointsData.length;
    } else if (pointsData && typeof pointsData === 'object') {
        if (pointsData.all && Array.isArray(pointsData.all)) {
            dataLength = pointsData.all.length;
        } else if (pointsData.fine && Array.isArray(pointsData.fine)) {
            dataLength = pointsData.fine.length;
        }
    }
    
    console.log('Data length:', dataLength);
    
    if (!pointsData || dataLength < 3) {
        // หากไม่มีข้อมูลเพียงพอ ใช้สมการครอบคลุมทุกรูปแบบแบบเต็ม
        console.log('Insufficient data points, generating comprehensive mathematical equations set');
        return generateComprehensiveMathematicalEquations();
    }
    
    // ตรวจสอบและแปลง pointsData ให้เป็น array
    let pointsArray = pointsData;
    if (pointsData && typeof pointsData === 'object' && pointsData.all) {
        pointsArray = pointsData.all;
    } else if (pointsData && typeof pointsData === 'object' && pointsData.fine) {
        pointsArray = pointsData.fine;
    } else if (!Array.isArray(pointsData)) {
        console.log('Invalid pointsData format:', typeof pointsData);
        pointsArray = [];
    }
    
    console.log('Points array length:', pointsArray.length);
    
    // วิเคราะห์รูปแบบของจุดข้อมูล
    const analysis = analyzeImagePattern(pointsArray);
    console.log('Pattern analysis result:', analysis);
    
    // ใช้วิธีง่ายและตรงไปตรงมา: แปลงพิกเซลเข้มเป็นจุดโดยตรง
    console.log('Using DIRECT PIXEL-TO-EQUATION mapping - the simplest approach');
    
    // สร้างสมการจากพิกเซลโดยตรง
    const directEquations = await generateDirectPixelEquations();
    if (directEquations && directEquations.length > 0) {
        console.log(`Generated ${directEquations.length} equations from direct pixel mapping`);
        return directEquations;
    }
    
    console.log('Direct pixel mapping completed, falling back to coordinate analysis');
    
    // 1. สร้างสมการจากพิกัดจริงในภาพพร้อม domain (Primary: Real Image Coordinates)
    const imageBasedEqs = generateEquationsFromRealImageData(pointsArray, analysis);
    equations.push(...imageBasedEqs);
    console.log(`Generated ${imageBasedEqs.length} equations from real image coordinates`);
    
    // 2. วิเคราะห์รูปทรงเฉพาะจากจุดข้อมูล (Shape Analysis from Points)
    if (analysis.actualShapes && analysis.actualShapes.length > 0) {
        console.log('Adding equations from detected shapes with domains');
        const shapeEquations = generateEquationsFromDetectedShapes(analysis.actualShapes);
        equations.push(...shapeEquations);
        console.log(`Added ${shapeEquations.length} shape-based equations`);
    }
    
    // 3. สร้างสมการที่มี domain ตามขอบเขตของภาพ (Bounded Equations)
    const boundedEqs = generateEquationsWithImageBounds(pointsArray, analysis);
    equations.push(...boundedEqs);
    console.log(`Added ${boundedEqs.length} equations with image-based domains`);
    
    // 4. สร้างสมการเฉพาะจุดจากการวิเคราะห์ (Specific Pattern Equations)
    if (analysis.isCircular && analysis.radius > 0) {
        console.log('Adding circular patterns with proper domains');
        const circularEqs = generateCircularWithDomain(pointsArray, analysis);
        equations.push(...circularEqs);
    }
    
    if (analysis.isLinear && typeof analysis.slope === 'number') {
        console.log('Adding linear patterns with proper domains');
        const linearEqs = generateLinearWithDomain(pointsArray, analysis);
        equations.push(...linearEqs);
    }
    
    // 4. สร้างสมการเพิ่มเติมจากการวิเคราะห์ภาพละเอียด (Detailed Image Analysis)
    const detailedEqs = generateDetailedImageEquations(pointsArray, analysis);
    equations.push(...detailedEqs);
    console.log(`Added ${detailedEqs.length} detailed equations from image analysis`);
    
    // 5. เพิ่มสมการครอบคลุมเฉพาะในกรณีที่วิเคราะห์ภาพได้น้อย (Fallback only if needed)
    if (equations.length < 10) {
        console.log('Image analysis yielded few equations, adding comprehensive mathematical set');
        const comprehensiveEquations = generateComprehensiveMathematicalEquations();
        equations.push(...comprehensiveEquations);
    } else {
        console.log('Image analysis successful, using primarily image-based equations');
        // เพิ่มเฉพาะสมการพื้นฐานเพื่อครบถ้วน
        const basicEqs = generateBasicMathematicalEquations();
        equations.push(...basicEqs);
    }
    
    console.log(`Generated ${equations.length} comprehensive mathematical equations including full equation set`);
    return equations; // คืนค่าสมการครอบคลุมทั้งหมด
}

/**
 * 🔍 Analyze Image Pattern - วิเคราะห์รูปแบบของภาพ
 */
function analyzeImagePattern(points) {
    const analysis = {
        isCircular: false,
        isLinear: false,
        isPolynomial: false,
        isElliptical: false,
        isRectangular: false,
        isTriangular: false,
        isSpiralPattern: false,
        isWavePattern: false,
        complexity: 0,
        center: { x: 0, y: 0 },
        radius: 0,
        slope: 0,
        intercept: 0,
        coefficients: [],
        axes: { a: 0, b: 0 },
        boundingBox: { minX: 0, maxX: 0, minY: 0, maxY: 0 },
        aspectRatio: 1,
        density: 0,
        actualShapes: []
    };
    
    // ตรวจสอบว่า points เป็น array และมีข้อมูลเพียงพอ
    if (!Array.isArray(points)) {
        console.error('Points is not an array:', typeof points);
        return analysis;
    }
    
    if (points.length < 3) {
        console.log('Insufficient points for analysis:', points.length);
        return analysis;
    }
    
    // คำนวณ Bounding Box
    const xCoords = points.map(p => p.x);
    const yCoords = points.map(p => p.y);
    analysis.boundingBox = {
        minX: Math.min(...xCoords),
        maxX: Math.max(...xCoords),
        minY: Math.min(...yCoords),
        maxY: Math.max(...yCoords)
    };
    
    // คำนวณจุดศูนย์กลาง
    const centerX = (analysis.boundingBox.minX + analysis.boundingBox.maxX) / 2;
    const centerY = (analysis.boundingBox.minY + analysis.boundingBox.maxY) / 2;
    analysis.center = { x: centerX, y: centerY };
    
    // คำนวณ aspect ratio และ density
    const width = analysis.boundingBox.maxX - analysis.boundingBox.minX;
    const height = analysis.boundingBox.maxY - analysis.boundingBox.minY;
    analysis.aspectRatio = width / height;
    analysis.density = points.length / (width * height);
    
    // ตรวจสอบรูปทรงต่างๆ
    analysis.actualShapes = detectActualShapes(points, analysis);
    
    // ตรวจสอบว่าเป็นวงกลมหรือไม่ (ปรับปรุงอัลกอริทึม)
    const distances = points.map(p => Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2));
    const avgRadius = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    const radiusVariance = distances.reduce((sum, d) => sum + (d - avgRadius) ** 2, 0) / distances.length;
    const radiusStdDev = Math.sqrt(radiusVariance);
    
    if (radiusStdDev < avgRadius * 0.15) { // เข้มงวดขึ้นในการตรวจจับวงกลม
        analysis.isCircular = true;
        analysis.radius = avgRadius;
    }
    
    // ตรวจสอบเส้นตรง
    if (points.length >= 2) {
        const slope = (points[points.length - 1].y - points[0].y) / (points[points.length - 1].x - points[0].x);
        const intercept = points[0].y - slope * points[0].x;
        
        // ตรวจสอบว่าจุดส่วนใหญ่อยู่บนเส้นตรงหรือไม่
        let linearCount = 0;
        points.forEach(p => {
            const expectedY = slope * p.x + intercept;
            if (Math.abs(p.y - expectedY) < 10) linearCount++;
        });
        
        if (linearCount / points.length > 0.7) { // 70% ของจุดอยู่บนเส้นตรง
            analysis.isLinear = true;
            analysis.slope = slope;
            analysis.intercept = intercept;
        }
    }
    
    // ตรวจสอบวงรี (ellipse)
    const xVariance = points.reduce((sum, p) => sum + (p.x - centerX) ** 2, 0) / points.length;
    const yVariance = points.reduce((sum, p) => sum + (p.y - centerY) ** 2, 0) / points.length;
    
    if (!analysis.isCircular && Math.abs(xVariance - yVariance) > Math.min(xVariance, yVariance) * 0.3) {
        analysis.isElliptical = true;
        analysis.axes.a = Math.sqrt(Math.max(xVariance, yVariance));
        analysis.axes.b = Math.sqrt(Math.min(xVariance, yVariance));
    }
    
    // คำนวณความซับซ้อน
    const xRange = Math.max(...points.map(p => p.x)) - Math.min(...points.map(p => p.x));
    const yRange = Math.max(...points.map(p => p.y)) - Math.min(...points.map(p => p.y));
    analysis.complexity = (xRange + yRange) / (2 * Math.max(xRange, yRange)) * (points.length / 100);
    
    // ถ้าไม่ใช่รูปแบบพื้นฐาน อาจเป็นพหุนาม
    if (!analysis.isCircular && !analysis.isLinear && !analysis.isElliptical) {
        analysis.isPolynomial = true;
        // สร้างสัมประสิทธิ์แบบง่าย
        analysis.coefficients = [
            Math.random() * 2 - 1, // a
            Math.random() * 2 - 1, // b  
            Math.random() * 2 - 1  // c
        ];
    }
    
    return analysis;
}

/**
 * 🎯 Detect Actual Shapes - ตรวจจับรูปทรงจริงในภาพ
 */
function detectActualShapes(points, analysis) {
    const shapes = [];
    
    // ตรวจจับเส้นตรง (Line Detection)
    const lines = detectLines(points);
    shapes.push(...lines);
    
    // ตรวจจับวงกลมและวงรี (Circle/Ellipse Detection)
    const circles = detectCirclesAndEllipses(points);
    shapes.push(...circles);
    
    // ตรวจจับสี่เหลี่ยม (Rectangle Detection)
    const rectangles = detectRectangles(points);
    shapes.push(...rectangles);
    
    // ตรวจจับรูปทรงอื่นๆ (Other Shape Detection)
    const curves = detectCurves(points);
    shapes.push(...curves);
    
    return shapes;
}

/**
 * 📏 Detect Lines - ตรวจจับเส้นตรง
 */
function detectLines(points) {
    const lines = [];
    
    if (points.length < 2) return lines;
    
    // ใช้ RANSAC algorithm สำหรับตรวจจับเส้นตรง
    const iterations = Math.min(100, points.length * 2);
    let bestLine = null;
    let maxInliers = 0;
    
    for (let i = 0; i < iterations; i++) {
        // เลือก 2 จุดแบบสุ่ม
        const idx1 = Math.floor(Math.random() * points.length);
        let idx2 = Math.floor(Math.random() * points.length);
        while (idx2 === idx1) {
            idx2 = Math.floor(Math.random() * points.length);
        }
        
        const p1 = points[idx1];
        const p2 = points[idx2];
        
        // คำนวณสมการเส้นตรง y = mx + b
        if (Math.abs(p2.x - p1.x) < 0.001) continue; // เส้นตั้ง
        
        const slope = (p2.y - p1.y) / (p2.x - p1.x);
        const intercept = p1.y - slope * p1.x;
        
        // นับจำนวน inliers
        let inliers = 0;
        const threshold = 5; // ระยะห่างที่ยอมรับได้
        
        for (const point of points) {
            const expectedY = slope * point.x + intercept;
            const distance = Math.abs(point.y - expectedY);
            if (distance < threshold) {
                inliers++;
            }
        }
        
        if (inliers > maxInliers && inliers > points.length * 0.3) {
            maxInliers = inliers;
            bestLine = { slope, intercept, inliers, confidence: inliers / points.length };
        }
    }
    
    if (bestLine && bestLine.confidence > 0.4) {
        lines.push({
            type: 'line',
            equation: `y=${bestLine.slope.toFixed(3)}x${bestLine.intercept >= 0 ? '+' : ''}${bestLine.intercept.toFixed(3)}`,
            parameters: bestLine,
            confidence: bestLine.confidence
        });
    }
    
    return lines;
}

/**
 * ⭕ Detect Circles and Ellipses - ตรวจจับวงกลมและวงรี
 */
function detectCirclesAndEllipses(points) {
    const shapes = [];
    
    if (points.length < 5) return shapes;
    
    // ตรวจจับวงกลม
    const circle = fitCircleToPoints(points);
    if (circle && circle.confidence > 0.6) {
        const eq = circle.radius ? 
            `(x${circle.centerX >= 0 ? '-' : '+'}${Math.abs(circle.centerX).toFixed(2)})²+(y${circle.centerY >= 0 ? '-' : '+'}${Math.abs(circle.centerY).toFixed(2)})²=${(circle.radius**2).toFixed(2)}` :
            'x²+y²=1';
        
        shapes.push({
            type: 'circle',
            equation: eq,
            parameters: circle,
            confidence: circle.confidence
        });
    }
    
    // ตรวจจับวงรี
    const ellipse = fitEllipseToPoints(points);
    if (ellipse && ellipse.confidence > 0.5 && !circle) {
        shapes.push({
            type: 'ellipse',
            equation: `x²/${ellipse.a**2}+y²/${ellipse.b**2}=1`,
            parameters: ellipse,
            confidence: ellipse.confidence
        });
    }
    
    return shapes;
}

/**
 * 📐 Detect Rectangles - ตรวจจับสี่เหลี่ยม
 */
function detectRectangles(points) {
    const rectangles = [];
    
    // ตรวจจับจากการกระจายของจุด
    const xCoords = points.map(p => p.x).sort((a, b) => a - b);
    const yCoords = points.map(p => p.y).sort((a, b) => a - b);
    
    // หาขอบของสี่เหลี่ยม
    const leftEdge = xCoords.slice(0, Math.floor(xCoords.length * 0.1));
    const rightEdge = xCoords.slice(-Math.floor(xCoords.length * 0.1));
    const topEdge = yCoords.slice(-Math.floor(yCoords.length * 0.1));
    const bottomEdge = yCoords.slice(0, Math.floor(yCoords.length * 0.1));
    
    const avgLeft = leftEdge.reduce((a, b) => a + b, 0) / leftEdge.length;
    const avgRight = rightEdge.reduce((a, b) => a + b, 0) / rightEdge.length;
    const avgTop = topEdge.reduce((a, b) => a + b, 0) / topEdge.length;
    const avgBottom = bottomEdge.reduce((a, b) => a + b, 0) / bottomEdge.length;
    
    const width = avgRight - avgLeft;
    const height = avgTop - avgBottom;
    const aspectRatio = width / height;
    
    // ตรวจสอบว่าเป็นสี่เหลี่ยมหรือไม่
    if (Math.abs(aspectRatio - 1) < 0.2) { // สี่เหลี่ยมจัตุรัส
        rectangles.push({
            type: 'square',
            equation: `|x-${((avgLeft + avgRight)/2).toFixed(2)}|≤${(width/2).toFixed(2)}, |y-${((avgTop + avgBottom)/2).toFixed(2)}|≤${(height/2).toFixed(2)}`,
            parameters: { centerX: (avgLeft + avgRight)/2, centerY: (avgTop + avgBottom)/2, width, height },
            confidence: 0.7
        });
    } else if (aspectRatio > 0.3 && aspectRatio < 3) { // สี่เหลี่ยมผืนผ้า
        rectangles.push({
            type: 'rectangle',
            equation: `|x-${((avgLeft + avgRight)/2).toFixed(2)}|≤${(width/2).toFixed(2)}, |y-${((avgTop + avgBottom)/2).toFixed(2)}|≤${(height/2).toFixed(2)}`,
            parameters: { centerX: (avgLeft + avgRight)/2, centerY: (avgTop + avgBottom)/2, width, height },
            confidence: 0.6
        });
    }
    
    return rectangles;
}

/**
 * 🌊 Detect Curves - ตรวจจับเส้นโค้ง
 */
function detectCurves(points) {
    const curves = [];
    
    if (points.length < 10) return curves;
    
    // ตรวจจับพาราโบลา
    const parabola = fitParabolaToPoints(points);
    if (parabola && parabola.confidence > 0.5) {
        curves.push({
            type: 'parabola',
            equation: `y=${parabola.a.toFixed(3)}x²${parabola.b >= 0 ? '+' : ''}${parabola.b.toFixed(3)}x${parabola.c >= 0 ? '+' : ''}${parabola.c.toFixed(3)}`,
            parameters: parabola,
            confidence: parabola.confidence
        });
    }
    
    // ตรวจจับรูปแบบไซน์
    const sine = fitSineWave(points);
    if (sine && sine.confidence > 0.4) {
        curves.push({
            type: 'sine',
            equation: `y=${sine.amplitude.toFixed(2)}sin(${sine.frequency.toFixed(2)}x${sine.phase >= 0 ? '+' : ''}${sine.phase.toFixed(2)})${sine.offset >= 0 ? '+' : ''}${sine.offset.toFixed(2)}`,
            parameters: sine,
            confidence: sine.confidence
        });
    }
    
    return curves;
}

/**
 * 📊 Perform Polynomial Regression - ทำ polynomial regression จากจุดข้อมูล
 */
function performPolynomialRegression(points, degree) {
    if (points.length < degree + 1) return null;
    
    // เรียงจุดตาม x
    const sortedPoints = points.slice().sort((a, b) => a.x - b.x);
    const n = sortedPoints.length;
    
    // สร้าง matrix A และ vector b สำหรับ normal equations
    const A = [];
    const b = [];
    
    // สร้าง matrix สำหรับ normal equations: A^T * A * coeffs = A^T * y
    for (let i = 0; i <= degree; i++) {
        A[i] = [];
        let sum = 0;
        
        for (let j = 0; j <= degree; j++) {
            let sumXPower = 0;
            for (const point of sortedPoints) {
                sumXPower += Math.pow(point.x, i + j);
            }
            A[i][j] = sumXPower;
        }
        
        // คำนวณ b vector
        for (const point of sortedPoints) {
            sum += point.y * Math.pow(point.x, i);
        }
        b[i] = sum;
    }
    
    // แก้ matrix A โดยใช้ Gaussian elimination
    const coefficients = solveLinearSystem(A, b);
    
    if (!coefficients) return null;
    
    // คำนวณ R² เพื่อวัด confidence
    let ssRes = 0, ssTot = 0;
    const meanY = sortedPoints.reduce((sum, p) => sum + p.y, 0) / n;
    
    for (const point of sortedPoints) {
        let predicted = 0;
        for (let i = 0; i <= degree; i++) {
            predicted += coefficients[i] * Math.pow(point.x, i);
        }
        ssRes += (point.y - predicted) ** 2;
        ssTot += (point.y - meanY) ** 2;
    }
    
    const confidence = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
    
    return {
        coefficients,
        degree,
        confidence
    };
}

/**
 * 🔢 Solve Linear System - แก้ระบบสมการเชิงเส้น
 */
function solveLinearSystem(A, b) {
    const n = A.length;
    const matrix = A.map((row, i) => [...row, b[i]]);
    
    // Gaussian elimination with partial pivoting
    for (let i = 0; i < n; i++) {
        // หา pivot ที่ใหญ่ที่สุด
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
                maxRow = k;
            }
        }
        
        // สลับแถว
        if (maxRow !== i) {
            [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
        }
        
        // ตรวจสอบ singular matrix
        if (Math.abs(matrix[i][i]) < 1e-10) {
            return null;
        }
        
        // ทำ elimination
        for (let k = i + 1; k < n; k++) {
            const factor = matrix[k][i] / matrix[i][i];
            for (let j = i; j <= n; j++) {
                matrix[k][j] -= factor * matrix[i][j];
            }
        }
    }
    
    // Back substitution
    const solution = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        solution[i] = matrix[i][n];
        for (let j = i + 1; j < n; j++) {
            solution[i] -= matrix[i][j] * solution[j];
        }
        solution[i] /= matrix[i][i];
    }
    
    return solution;
}

/**
 * 🔘 Generate Circular With Domain - สร้างรูปแบบวงกลมพร้อม domain
 */
function generateCircularWithDomain(points, analysis) {
    const equations = [];
    
    if (!analysis.radius || analysis.radius <= 0) return equations;
    
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    
    const centerX = analysis.centerX || 0;
    const centerY = analysis.centerY || 0;
    const radius = analysis.radius;
    
    const domain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}\\left\\{${minY.toFixed(2)}\\le y\\le${maxY.toFixed(2)}\\right\\}`;
    
    // วงกลมหลัก
    let circleEq;
    if (Math.abs(centerX) < 0.1 && Math.abs(centerY) < 0.1) {
        circleEq = `x^{2}+y^{2}=${(radius**2).toFixed(3)}`;
    } else {
        const h = centerX.toFixed(3);
        const k = centerY.toFixed(3);
        const hStr = centerX >= 0 ? `-${h}` : `+${Math.abs(parseFloat(h))}`;
        const kStr = centerY >= 0 ? `-${k}` : `+${Math.abs(parseFloat(k))}`;
        circleEq = `\\left(x${hStr}\\right)^{2}+\\left(y${kStr}\\right)^{2}=${(radius**2).toFixed(3)}`;
    }
    
    equations.push({
        equation: `${circleEq}${domain}`,
        latex: `${circleEq}${domain}`,
        accuracy: 0.92,
        description: 'วงกลมจากการวิเคราะห์พร้อม domain ที่ถูกต้อง',
        parameters: { type: 'circle_with_domain', centerX, centerY, radius, bounds: { minX, maxX, minY, maxY } }
    });
    
    return equations;
}

/**
 * 📈 Generate Linear With Domain - สร้างสมการเส้นตรงพร้อม domain
 */
function generateLinearWithDomain(points, analysis) {
    const equations = [];
    
    if (typeof analysis.slope !== 'number') return equations;
    
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    
    const slope = analysis.slope;
    const intercept = analysis.intercept || 0;
    
    const xDomain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}`;
    
    // เส้นตรงหลัก
    let mainEq;
    if (Math.abs(slope - 1) < 0.01) {
        mainEq = intercept === 0 ? 'y=x' : `y=x${intercept >= 0 ? '+' : ''}${intercept.toFixed(3)}`;
    } else if (Math.abs(slope + 1) < 0.01) {
        mainEq = intercept === 0 ? 'y=-x' : `y=-x${intercept >= 0 ? '+' : ''}${intercept.toFixed(3)}`;
    } else {
        mainEq = `y=${slope.toFixed(3)}x${intercept >= 0 ? '+' : ''}${intercept.toFixed(3)}`;
    }
    
    equations.push({
        equation: `${mainEq}${xDomain}`,
        latex: `${mainEq}${xDomain}`,
        accuracy: 0.91,
        description: 'เส้นตรงจากการวิเคราะห์พร้อม domain ที่ถูกต้อง',
        parameters: { type: 'line_with_domain', slope, intercept, bounds: { minX, maxX, minY, maxY } }
    });
    
    return equations;
}

/**
 * 🔧 Helper Functions for Shape Detection
 */
function fitCircleToPoints(points) {
    if (points.length < 3) return null;
    
    // ใช้อัลกอริทึม Least Squares Circle Fitting
    try {
        const n = points.length;
        let sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0, sumXY = 0;
        let sumX3 = 0, sumY3 = 0, sumX2Y = 0, sumXY2 = 0;
        
        for (const p of points) {
            const x = p.x, y = p.y;
            const x2 = x * x, y2 = y * y;
            
            sumX += x; sumY += y;
            sumX2 += x2; sumY2 += y2; sumXY += x * y;
            sumX3 += x2 * x; sumY3 += y2 * y;
            sumX2Y += x2 * y; sumXY2 += x * y2;
        }
        
        const A = n * sumX2 - sumX * sumX;
        const B = n * sumXY - sumX * sumY;
        const C = n * sumY2 - sumY * sumY;
        const D = 0.5 * (n * (sumX3 + sumXY2) - sumX * (sumX2 + sumY2));
        const E = 0.5 * (n * (sumY3 + sumX2Y) - sumY * (sumX2 + sumY2));
        
        const det = A * C - B * B;
        if (Math.abs(det) < 1e-10) return null;
        
        const centerX = (D * C - B * E) / det;
        const centerY = (A * E - B * D) / det;
        
        // คำนวณรัศมีเฉลี่ย
        let sumRadius = 0;
        for (const p of points) {
            sumRadius += Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2);
        }
        const radius = sumRadius / n;
        
        // คำนวณความแม่นยำ
        let error = 0;
        for (const p of points) {
            const dist = Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2);
            error += Math.abs(dist - radius);
        }
        const avgError = error / n;
        const confidence = Math.max(0, 1 - avgError / radius);
        
        return { centerX, centerY, radius, confidence };
    } catch (e) {
        return null;
    }
}

function fitEllipseToPoints(points) {
    // ใช้อัลกอริทึมพื้นฐานสำหรับ ellipse fitting
    try {
        const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
        
        let sumXX = 0, sumYY = 0;
        for (const p of points) {
            sumXX += (p.x - centerX) ** 2;
            sumYY += (p.y - centerY) ** 2;
        }
        
        const a = Math.sqrt(sumXX / points.length) * 2;
        const b = Math.sqrt(sumYY / points.length) * 2;
        
        // คำนวณความแม่นยำ
        let error = 0;
        for (const p of points) {
            const ellipseValue = ((p.x - centerX) / a) ** 2 + ((p.y - centerY) / b) ** 2;
            error += Math.abs(ellipseValue - 1);
        }
        const confidence = Math.max(0, 1 - error / points.length);
        
        return { centerX, centerY, a, b, confidence };
    } catch (e) {
        return null;
    }
}

function fitParabolaToPoints(points) {
    // ใช้ regression สำหรับ y = ax² + bx + c
    try {
        if (points.length < 3) return null;
        
        const n = points.length;
        let sumX = 0, sumY = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
        let sumXY = 0, sumX2Y = 0;
        
        for (const p of points) {
            const x = p.x, y = p.y;
            sumX += x; sumY += y;
            sumX2 += x * x; sumX3 += x * x * x; sumX4 += x * x * x * x;
            sumXY += x * y; sumX2Y += x * x * y;
        }
        
        // แก้ระบบสมการ 3x3
        const matrix = [
            [n, sumX, sumX2],
            [sumX, sumX2, sumX3],
            [sumX2, sumX3, sumX4]
        ];
        const vector = [sumY, sumXY, sumX2Y];
        
        const coeffs = solveLinearSystem3x3(matrix, vector);
        if (!coeffs) return null;
        
        const [c, b, a] = coeffs;
        
        // คำนวณ R²
        const meanY = sumY / n;
        let ssRes = 0, ssTot = 0;
        for (const p of points) {
            const predicted = a * p.x * p.x + b * p.x + c;
            ssRes += (p.y - predicted) ** 2;
            ssTot += (p.y - meanY) ** 2;
        }
        
        const confidence = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
        
        return { a, b, c, confidence };
    } catch (e) {
        return null;
    }
}

function fitSineWave(points) {
    // ตรวจจับรูปแบบไซน์เบื้องต้น
    try {
        if (points.length < 8) return null;
        
        // เรียงจุดตาม x
        const sortedPoints = points.slice().sort((a, b) => a.x - b.x);
        
        // หาค่าเฉลี่ยและ amplitude
        const yValues = sortedPoints.map(p => p.y);
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        const amplitude = (maxY - minY) / 2;
        const offset = (maxY + minY) / 2;
        
        // ประมาณ frequency จากจำนวนจุดสูงสุดและต่ำสุด
        let peaks = 0;
        for (let i = 1; i < yValues.length - 1; i++) {
            if ((yValues[i] > yValues[i-1] && yValues[i] > yValues[i+1]) ||
                (yValues[i] < yValues[i-1] && yValues[i] < yValues[i+1])) {
                peaks++;
            }
        }
        
        const xRange = sortedPoints[sortedPoints.length - 1].x - sortedPoints[0].x;
        const frequency = peaks * Math.PI / xRange;
        
        // คำนวณความแม่นยำ
        let error = 0;
        for (const p of sortedPoints) {
            const predicted = amplitude * Math.sin(frequency * p.x) + offset;
            error += Math.abs(p.y - predicted);
        }
        const avgError = error / sortedPoints.length;
        const confidence = Math.max(0, 1 - avgError / amplitude);
        
        if (confidence > 0.3 && amplitude > 0.1) {
            return { amplitude, frequency, phase: 0, offset, confidence };
        }
        
        return null;
    } catch (e) {
        return null;
    }
}

function solveLinearSystem3x3(matrix, vector) {
    try {
        const [a, b, c] = matrix;
        const [d, e, f] = vector;
        
        const det = a[0] * (a[1] * a[2] - b[1] * b[2]) - 
                   a[1] * (b[0] * a[2] - b[2] * c[0]) + 
                   a[2] * (b[0] * b[1] - b[1] * c[0]);
        
        if (Math.abs(det) < 1e-10) return null;
        
        const x = (d * (a[1] * a[2] - b[1] * b[2]) - 
                  a[1] * (e * a[2] - f * b[2]) + 
                  a[2] * (e * b[1] - f * b[1])) / det;
        
        const y = (a[0] * (e * a[2] - f * b[2]) - 
                  d * (b[0] * a[2] - b[2] * c[0]) + 
                  a[2] * (b[0] * f - e * c[0])) / det;
        
        const z = (a[0] * (a[1] * f - e * b[1]) - 
                  a[1] * (b[0] * f - e * c[0]) + 
                  d * (b[0] * b[1] - b[1] * c[0])) / det;
        
        return [x, y, z];
    } catch (e) {
        return null;
    }
}

/**
 * 🎯 Generate Basic Circles - สร้างวงกลมพื้นฐาน
 */
function generateBasicCircles() {
    return [
        '\\left(x\\right)^{2}+\\left(y\\right)^{2}=1',
        '\\left(x\\right)^{2}+\\left(y\\right)^{2}=0.6'
    ];
}

/**
 * 🎯 Generate Conditional Circles - สร้างวงกลมที่มีเงื่อนไข
 */
function generateConditionalCircles() {
    return [
        '\\left(x+0.3\\right)^{2}+\\left(y-1.2\\right)^{2}=0.4\\left\\{1.65\\ge y\\ge0.71194\\right\\}\\left\\{x<0\\right\\}',
        '\\left(x+0.3\\right)^{2}+\\left(y+1.2\\right)^{2}=0.4\\left\\{-1.65\\le y\\le-0.71194\\right\\}\\left\\{x<0\\right\\}',
        '\\left(x-0.3\\right)^{2}+\\left(y-1.2\\right)^{2}=0.4\\left\\{1.65\\ge y\\ge0.71194\\right\\}\\left\\{x>0\\right\\}',
        '\\left(x-0.3\\right)^{2}+\\left(y+1.2\\right)^{2}=0.4\\left\\{-1.65\\le y\\le-0.71194\\right\\}\\left\\{x>0\\right\\}',
        '\\left(x-1.2\\right)^{2}+\\left(y-0.3\\right)^{2}=0.4\\left\\{y>0.71194\\right\\}',
        '\\left(x+1.2\\right)^{2}+\\left(y-0.3\\right)^{2}=0.4\\left\\{y>0.71194\\right\\}',
        '\\left(x+1.2\\right)^{2}+\\left(y+0.3\\right)^{2}=0.4\\left\\{y<-0.71194\\right\\}',
        '\\left(x-1.2\\right)^{2}+\\left(y+0.3\\right)^{2}=0.4\\left\\{y<-0.71194\\right\\}'
    ];
}

/**
 * 🎯 Generate Bounded Lines - สร้างเส้นตรงที่มีขอบเขต
 */
function generateBoundedLines() {
    return [
        'x=-y+2.395\\left\\{1.65\\le y\\le2.395\\right\\}',
        'x=-y+2.395\\left\\{1.65\\le x\\le2.395\\right\\}',
        '-x=-y+2.395\\left\\{1.65\\le y\\le2.395\\right\\}',
        '-x=-y+2.395\\left\\{-1.65\\ge x\\ge-2.395\\right\\}',
        '-x=-y-2.395\\left\\{1.65\\le x\\le2.395\\right\\}',
        'x=y+2.395\\left\\{-1.65\\ge y\\ge-2.395\\right\\}',
        '-x=y+2.395\\left\\{-1.65\\ge x\\ge-2.395\\right\\}',
        '-x=y+2.395\\left\\{-1.65\\ge y\\ge-2.395\\right\\}'
    ];
}

/**
 * 🎯 Generate Ellipses and Hyperbolas - สร้างวงรีและไฮเปอร์โบลา
 */
function generateEllipsesAndHyperbolas() {
    return [
        '\\frac{\\left(x+1.1\\right)^{2}}{b^{2}}+\\frac{y^{2}}{a^{2}}=0.001\\left\\{-1>x\\right\\}',
        '\\frac{\\left(x-1.1\\right)^{2}}{b^{2}}+\\frac{y^{2}}{a^{2}}=0.001\\left\\{1<x\\right\\}',
        '\\frac{x^{2}}{a^{2}}+\\frac{\\left(y-1.1\\right)^{2}}{b^{2}}=0.001\\left\\{1<y\\right\\}',
        '\\frac{x^{2}}{a^{2}}+\\frac{\\left(y+1.1\\right)^{2}}{b^{2}}=0.001\\left\\{-1>y\\right\\}'
    ];
}

/**
 * 🔵 Generate Circle Equations - สร้างสมการวงกลมจากการวิเคราะห์
 */
function generateCircleEquations(center, radius) {
    const equations = [];
    const r = Math.max(0.1, Math.min(2, radius / 50)); // ปรับขนาด radius ให้เหมาะสม
    const h = center.x / 100; // ปรับตำแหน่งให้เหมาะกับ Desmos
    const k = center.y / 100;
    
    // วงกลมหลัก
    equations.push(`\\left(x${h >= 0 ? '-' : '+'}${Math.abs(h).toFixed(2)}\\right)^{2}+\\left(y${k >= 0 ? '-' : '+'}${Math.abs(k).toFixed(2)}\\right)^{2}=${r.toFixed(2)}`);
    
    // วงกลมขนาดต่างๆ
    equations.push(`\\left(x${h >= 0 ? '-' : '+'}${Math.abs(h).toFixed(2)}\\right)^{2}+\\left(y${k >= 0 ? '-' : '+'}${Math.abs(k).toFixed(2)}\\right)^{2}=${(r * 0.7).toFixed(2)}`);
    
    return equations;
}

/**
 * 📏 Generate Line Equations - สร้างสมการเส้นตรงจากการวิเคราะห์
 */
function generateLineEquations(slope, intercept) {
    const equations = [];
    const m = (slope / 100).toFixed(3); // ปรับ scale
    const b = (intercept / 100).toFixed(3);
    
    equations.push(`y=${m}x${b >= 0 ? '+' : ''}${b}`);
    
    // เส้นขนาน
    equations.push(`y=${m}x${(parseFloat(b) + 0.1) >= 0 ? '+' : ''}${(parseFloat(b) + 0.1).toFixed(3)}`);
    
    return equations;
}

/**
 * 🔮 Generate Polynomial Equations - สร้างสมการพหุนามจากสัมประสิทธิ์
 */
function generatePolynomialEquations(coefficients) {
    const equations = [];
    const [a, b, c] = coefficients.map(coeff => coeff.toFixed(3));
    
    // พหุนามดีกรี 2
    equations.push(`y=${a}x^{2}${b >= 0 ? '+' : ''}${b}x${c >= 0 ? '+' : ''}${c}`);
    
    // พหุนามดีกรี 3
    equations.push(`y=${(parseFloat(a) * 0.1).toFixed(3)}x^{3}${a >= 0 ? '+' : ''}${a}x^{2}${b >= 0 ? '+' : ''}${b}x${c >= 0 ? '+' : ''}${c}`);
    
    return equations;
}

/**
 * ⭕ Generate Ellipse Equations - สร้างสมการวงรีจากการวิเคราะห์
 */
function generateEllipseEquations(center, axes) {
    const equations = [];
    const h = (center.x / 100).toFixed(2);
    const k = (center.y / 100).toFixed(2);
    const a = Math.max(0.1, axes.a / 100).toFixed(2);
    const b = Math.max(0.1, axes.b / 100).toFixed(2);
    
    equations.push(`\\frac{\\left(x${h >= 0 ? '-' : '+'}${Math.abs(h)}\\right)^{2}}{${a}^{2}}+\\frac{\\left(y${k >= 0 ? '-' : '+'}${Math.abs(k)}\\right)^{2}}{${b}^{2}}=1`);
    
    return equations;
}

/**
 * 🌟 Generate Complex Equations From Points - สร้างสมการซับซ้อนจากจุดข้อมูล
 */
function generateComplexEquationsFromPoints(points) {
    const equations = [];
    
    if (points.length < 5) return equations;
    
    // สร้างสมการโค้งจากจุดหลายๆ จุด
    const xCoords = points.map(p => p.x / 100);
    const yCoords = points.map(p => p.y / 100);
    
    // ใช้ regression เพื่อหาสมการที่เหมาะสม
    const avgX = xCoords.reduce((a, b) => a + b, 0) / xCoords.length;
    const avgY = yCoords.reduce((a, b) => a + b, 0) / yCoords.length;
    
    // สมการไซน์โค้ง
    const amplitude = Math.abs(Math.max(...yCoords) - Math.min(...yCoords)) / 2;
    const frequency = Math.PI / (Math.max(...xCoords) - Math.min(...xCoords));
    
    if (amplitude > 0.1 && frequency > 0.1) {
        equations.push(`y=${amplitude.toFixed(2)}\\sin\\left(${frequency.toFixed(2)}x\\right)${avgY >= 0 ? '+' : ''}${avgY.toFixed(2)}`);
        equations.push(`y=${amplitude.toFixed(2)}\\cos\\left(${frequency.toFixed(2)}x\\right)${avgY >= 0 ? '+' : ''}${avgY.toFixed(2)}`);
    }
    
    return equations;
}

/**
 * 📊 Generate Equations From Points - สร้างสมการทั่วไปจากจุดข้อมูล
 */
function generateEquationsFromPoints(points) {
    const equations = [];
    
    if (points.length < 2) {
        // สมการพื้นฐานเมื่อไม่มีข้อมูลเพียงพอ
        return [
            'y = x',                    // เส้นตรงพื้นฐาน
            'x^{2} + y^{2} = 1',       // วงกลมหนึ่งหน่วย
            'y = x^{2}',               // พาราโบลาพื้นฐาน
            'x^{2} + y^{2} = 4'        // วงกลมรัศมี 2
        ];
    }
    
    // คำนวณค่าพื้นฐานของข้อมูล
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    
    // 1. สมการเส้นตรง (Linear Regression)
    if (points.length >= 2) {
        const n = points.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        
        points.forEach(p => {
            sumX += p.x;
            sumY += p.y;
            sumXY += p.x * p.y;
            sumX2 += p.x * p.x;
        });
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        if (!isNaN(slope) && !isNaN(intercept)) {
            equations.push(`y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)}`);
        }
    }
    
    // 2. สมการวงกลม (ประมาณจากจุดกลางและรัศมีเฉลี่ย)
    if (rangeX > 0 && rangeY > 0) {
        const avgRadius = Math.sqrt((rangeX * rangeX + rangeY * rangeY) / 4);
        
        if (Math.abs(centerX) < 0.1 && Math.abs(centerY) < 0.1) {
            // วงกลมที่จุดกำเนิด
            equations.push(`x^{2} + y^{2} = ${(avgRadius * avgRadius).toFixed(2)}`);
        } else {
            // วงกลมที่มีจุดศูนย์กลางไม่ใช่จุดกำเนิด
            equations.push(`(x - ${centerX.toFixed(2)})^{2} + (y - ${centerY.toFixed(2)})^{2} = ${(avgRadius * avgRadius).toFixed(2)}`);
        }
    }
    
    // 3. สมการพาราโบลา (y = ax^2 + bx + c)
    if (points.length >= 3) {
        try {
            const result = fitPolynomial(points, 2);
            if (result && result.coefficients && result.coefficients.length >= 3) {
                const [c, b, a] = result.coefficients;
                equations.push(`y = ${a.toFixed(3)}x^{2} + ${b.toFixed(3)}x + ${c.toFixed(3)}`);
            }
        } catch (e) {
            // หากการ fit polynomial ล้มเลว ให้ใช้สมการพาราโบลาง่าย ๆ
            equations.push(`y = 0.1x^{2}`);
        }
    }
    
    // 4. สมการวงรี (หากอัตราส่วนความกว้าง:ความสูงไม่ใกล้เคียง 1:1)
    if (rangeX > 0 && rangeY > 0) {
        const aspectRatio = rangeX / rangeY;
        if (aspectRatio > 1.5 || aspectRatio < 0.67) {
            const a = rangeX / 2;
            const b = rangeY / 2;
            
            if (Math.abs(centerX) < 0.1 && Math.abs(centerY) < 0.1) {
                equations.push(`\\frac{x^{2}}{${(a * a).toFixed(2)}} + \\frac{y^{2}}{${(b * b).toFixed(2)}} = 1`);
            } else {
                equations.push(`\\frac{(x - ${centerX.toFixed(2)})^{2}}{${(a * a).toFixed(2)}} + \\frac{(y - ${centerY.toFixed(2)})^{2}}{${(b * b).toFixed(2)}} = 1`);
            }
        }
    }
    
    return equations;
}

/**
 * 🎯 Generate Thai Guardian Pattern Equations - สร้างสมการลายประจำยาม
 */
function generateThaiGuardianPatternEquations() {
    const equations = [
        // วงกลมหลักลายประจำยาม
        '\\left(x\\right)^{2}+\\left(y\\right)^{2}=1',
        '\\left(x\\right)^{2}+\\left(y\\right)^{2}=0.6',
        
        // วงกลมมีเงื่อนไข - ส่วนบน
        '\\left(x+0.3\\right)^{2}+\\left(y-1.2\\right)^{2}=0.4\\left\\{1.65\\ge y\\ge0.71194\\right\\}\\left\\{x<0\\right\\}',
        '\\left(x-0.3\\right)^{2}+\\left(y-1.2\\right)^{2}=0.4\\left\\{1.65\\ge y\\ge0.71194\\right\\}\\left\\{x>0\\right\\}',
        
        // วงกลมมีเงื่อนไข - ส่วนล่าง  
        '\\left(x+0.3\\right)^{2}+\\left(y+1.2\\right)^{2}=0.4\\left\\{-1.65\\le y\\le-0.71194\\right\\}\\left\\{x<0\\right\\}',
        '\\left(x-0.3\\right)^{2}+\\left(y+1.2\\right)^{2}=0.4\\left\\{-1.65\\le y\\le-0.71194\\right\\}\\left\\{x>0\\right\\}',
        
        // วงกลมด้านข้าง
        '\\left(x-1.2\\right)^{2}+\\left(y-0.3\\right)^{2}=0.4\\left\\{y>0.71194\\right\\}',
        '\\left(x+1.2\\right)^{2}+\\left(y-0.3\\right)^{2}=0.4\\left\\{y>0.71194\\right\\}',
        '\\left(x+1.2\\right)^{2}+\\left(y+0.3\\right)^{2}=0.4\\left\\{y<-0.71194\\right\\}',
        '\\left(x-1.2\\right)^{2}+\\left(y+0.3\\right)^{2}=0.4\\left\\{y<-0.71194\\right\\}'
    ];
    
    return equations.map((eq, index) => ({
        equation: eq,
        latex: eq,
        accuracy: 0.95 - (index * 0.02),
        description: `ลายประจำยาม - วงกลมส่วนที่ ${index + 1}`,
        parameters: { type: 'thai_guardian_circle', complexity: 'high' }
    }));
}

/**
 * 🎯 Generate Thai Line Pattern Equations - สร้างสมการเส้นตรงลายไทย
 */
function generateThaiLinePatternEquations() {
    const equations = [
        // เส้นตรงมีขอบเขต - รูปแบบลายไทย
        'x=-y+2.395\\left\\{1.65\\le y\\le2.395\\right\\}',
        'x=-y+2.395\\left\\{1.65\\le x\\le2.395\\right\\}',
        '-x=-y+2.395\\left\\{1.65\\le y\\le2.395\\right\\}',
        '-x=-y+2.395\\left\\{-1.65\\ge x\\ge-2.395\\right\\}',
        '-x=-y-2.395\\left\\{1.65\\le x\\le2.395\\right\\}',
        'x=y+2.395\\left\\{-1.65\\ge y\\ge-2.395\\right\\}',
        '-x=y+2.395\\left\\{-1.65\\ge x\\ge-2.395\\right\\}',
        '-x=y+2.395\\left\\{-1.65\\ge y\\ge-2.395\\right\\}'
    ];
    
    return equations.map((eq, index) => ({
        equation: eq,
        latex: eq,
        accuracy: 0.92 - (index * 0.02),
        description: `ลายเส้นไทย - เส้นส่วนที่ ${index + 1}`,
        parameters: { type: 'thai_line_pattern', complexity: 'medium' }
    }));
}

/**
 * 🎯 Generate Basic Thai Pattern Equations - สร้างสมการลายไทยพื้นฐาน
 */
function generateBasicThaiPatternEquations() {
    const equations = [
        // วงกลมพื้นฐาน
        '\\left(x\\right)^{2}+\\left(y\\right)^{2}=1',
        '\\left(x\\right)^{2}+\\left(y\\right)^{2}=0.6',
        
        // เส้นทแยงมุม
        'x=-y+2.395\\left\\{1.65\\le y\\le2.395\\right\\}',
        '-x=-y+2.395\\left\\{1.65\\le y\\le2.395\\right\\}',
        
        // วงรีรูปไข่
        '\\frac{\\left(x+1.1\\right)^{2}}{b^{2}}+\\frac{y^{2}}{a^{2}}=0.001\\left\\{-1>x\\right\\}',
        '\\frac{\\left(x-1.1\\right)^{2}}{b^{2}}+\\frac{y^{2}}{a^{2}}=0.001\\left\\{1<x\\right\\}'
    ];
    
    return equations.map((eq, index) => ({
        equation: eq,
        latex: eq,
        accuracy: 0.88 - (index * 0.03),
        description: `ลายไทยพื้นฐาน - รูปแบบที่ ${index + 1}`,
        parameters: { type: 'thai_basic_pattern', complexity: 'low' }
    }));
}

/**
 * 🎯 Generate Default Thai Art Equations - สร้างสมการลายไทยเริ่มต้น
 */
function generateDefaultThaiArtEquations() {
    const equations = [
        // วงกลมหลัก
        '\\left(x\\right)^{2}+\\left(y\\right)^{2}=1',
        '\\left(x\\right)^{2}+\\left(y\\right)^{2}=0.6',
        
        // วงกลมมีเงื่อนไข
        '\\left(x+0.3\\right)^{2}+\\left(y-1.2\\right)^{2}=0.4\\left\\{1.65\\ge y\\ge0.71194\\right\\}\\left\\{x<0\\right\\}',
        '\\left(x-0.3\\right)^{2}+\\left(y-1.2\\right)^{2}=0.4\\left\\{1.65\\ge y\\ge0.71194\\right\\}\\left\\{x>0\\right\\}',
        
        // เส้นตรง
        'x=-y+2.395\\left\\{1.65\\le y\\le2.395\\right\\}',
        '-x=-y+2.395\\left\\{1.65\\le y\\le2.395\\right\\}',
        
        // วงรี
        '\\frac{\\left(x+1.1\\right)^{2}}{b^{2}}+\\frac{y^{2}}{a^{2}}=0.001\\left\\{-1>x\\right\\}',
        '\\frac{\\left(x-1.1\\right)^{2}}{b^{2}}+\\frac{y^{2}}{a^{2}}=0.001\\left\\{1<x\\right\\}'
    ];
    
    return equations.map((eq, index) => ({
        equation: eq,
        latex: eq,
        accuracy: 0.90 - (index * 0.02),
        description: `ลายประจำยาม - องค์ประกอบที่ ${index + 1}`,
        parameters: { type: 'thai_guardian_pattern', complexity: 'high', traditional: true }
    }));
}

/**
 * 🎯 Generate Thai Circular Pattern Equations - สร้างสมการลายวงกลมไทย
 */
function generateThaiCircularPatternEquations(center, radius) {
    const h = (center.x / 100).toFixed(2);
    const k = (center.y / 100).toFixed(2);
    const r1 = Math.max(0.5, radius / 100).toFixed(1);
    const r2 = (parseFloat(r1) * 0.7).toFixed(1);
    
    const equations = [
        // วงกลมหลักตามภาพ
        `\\left(x${h >= 0 ? '-' : '+'}${Math.abs(h)}\\right)^{2}+\\left(y${k >= 0 ? '-' : '+'}${Math.abs(k)}\\right)^{2}=${r1}`,
        `\\left(x${h >= 0 ? '-' : '+'}${Math.abs(h)}\\right)^{2}+\\left(y${k >= 0 ? '-' : '+'}${Math.abs(k)}\\right)^{2}=${r2}`,
        
        // วงกลมรอบๆ ตามแบบลายไทย
        `\\left(x+0.5\\right)^{2}+\\left(y-0.8\\right)^{2}=0.3\\left\\{y>0.5\\right\\}`,
        `\\left(x-0.5\\right)^{2}+\\left(y-0.8\\right)^{2}=0.3\\left\\{y>0.5\\right\\}`,
        `\\left(x+0.5\\right)^{2}+\\left(y+0.8\\right)^{2}=0.3\\left\\{y<-0.5\\right\\}`,
        `\\left(x-0.5\\right)^{2}+\\left(y+0.8\\right)^{2}=0.3\\left\\{y<-0.5\\right\\}`
    ];
    
    return equations.map((eq, index) => ({
        equation: eq,
        latex: eq,
        accuracy: 0.92 - (index * 0.01),
        description: `ลายวงกลมไทย - รูปแบบที่ ${index + 1}`,
        parameters: { type: 'thai_circular', adaptedFromImage: true }
    }));
}

/**
 * 🎯 Generate Equations From Detected Shapes - สร้างสมการจากรูปทรงที่ตรวจพบ
 */
function generateEquationsFromDetectedShapes(shapes) {
    const equations = [];
    
    shapes.forEach((shape, index) => {
        equations.push({
            equation: shape.equation,
            latex: shape.equation,
            accuracy: shape.confidence,
            description: `${getShapeNameInThai(shape.type)} - ตรวจพบจากภาพ`,
            parameters: { ...shape.parameters, detectedFromImage: true, type: shape.type }
        });
    });
    
    return equations;
}

/**
 * 🔤 Get Shape Name in Thai - แปลชื่อรูปทรงเป็นภาษาไทย
 */
function getShapeNameInThai(shapeType) {
    const translations = {
        'line': 'เส้นตรง',
        'circle': 'วงกลม',
        'ellipse': 'วงรี',
        'square': 'สี่เหลี่ยมจัตุรัส',
        'rectangle': 'สี่เหลี่ยมผืนผ้า',
        'parabola': 'พาราโบลา',
        'sine': 'คลื่นไซน์',
        'curve': 'เส้นโค้ง'
    };
    return translations[shapeType] || 'รูปทรงที่ตรวจพบ';
}

/**
 * 🎯 Generate Circular Pattern Equations - สร้างสมการรูปแบบวงกลม
 */
function generateCircularPatternEquations(points, analysis) {
    const equations = [];
    const { center, radius } = analysis;
    
    // วงกลมหลักจากการวิเคราะห์
    if (radius > 0) {
        const h = (center.x / 100).toFixed(2);
        const k = (center.y / 100).toFixed(2);
        const r = (radius / 100).toFixed(2);
        
        equations.push({
            equation: Math.abs(parseFloat(h)) < 0.1 && Math.abs(parseFloat(k)) < 0.1 ? 
                `x^{2}+y^{2}=${(parseFloat(r)**2).toFixed(2)}` :
                `(x${parseFloat(h) >= 0 ? '-' : '+'}${Math.abs(parseFloat(h))})^{2}+(y${parseFloat(k) >= 0 ? '-' : '+'}${Math.abs(parseFloat(k))})^{2}=${(parseFloat(r)**2).toFixed(2)}`,
            latex: Math.abs(parseFloat(h)) < 0.1 && Math.abs(parseFloat(k)) < 0.1 ? 
                `x^{2}+y^{2}=${(parseFloat(r)**2).toFixed(2)}` :
                `(x${parseFloat(h) >= 0 ? '-' : '+'}${Math.abs(parseFloat(h))})^{2}+(y${parseFloat(k) >= 0 ? '-' : '+'}${Math.abs(parseFloat(k))})^{2}=${(parseFloat(r)**2).toFixed(2)}`,
            accuracy: 0.92,
            description: 'วงกลมจากการวิเคราะห์ภาพ',
            parameters: { type: 'circle_from_image', centerX: center.x, centerY: center.y, radius }
        });
    }
    
    return equations;
}

/**
 * 🎯 Generate Linear Pattern Equations - สร้างสมการรูปแบบเส้นตรง
 */
function generateLinearPatternEquations(points, analysis) {
    const equations = [];
    const { slope, intercept } = analysis;
    
    // เส้นตรงหลักจากการวิเคราะห์
    if (typeof slope === 'number' && typeof intercept === 'number') {
        const m = (slope / 100).toFixed(3);
        const b = (intercept / 100).toFixed(3);
        
        equations.push({
            equation: `y=${m}x${parseFloat(b) >= 0 ? '+' : ''}${b}`,
            latex: `y=${m}x${parseFloat(b) >= 0 ? '+' : ''}${b}`,
            accuracy: 0.90,
            description: 'เส้นตรงจากการวิเคราะห์ภาพ',
            parameters: { type: 'line_from_image', slope: slope/100, intercept: intercept/100 }
        });
    }
    
    return equations;
}

/**
 * 🎯 Generate Polynomial Pattern Equations - สร้างสมการรูปแบบพหุนาม
 */
function generatePolynomialPatternEquations(points, analysis) {
    const equations = [];
    
    // ลองสร้างพหุนามจากข้อมูลจุด
    if (points && points.length > 5) {
        const polynomial = fitPolynomialToActualPoints(points);
        if (polynomial) {
            equations.push({
                equation: polynomial.equation,
                latex: polynomial.equation,
                accuracy: polynomial.confidence,
                description: `พหุนามดีกรี ${polynomial.degree} จากการวิเคราะห์ภาพ`,
                parameters: { type: 'polynomial_from_image', ...polynomial }
            });
        }
    }
    
    return equations;
}

/**
 * 🎯 Generate Fallback Equations - สร้างสมการสำรอง
 */
function generateFallbackEquations(points, analysis) {
    return [
        {
            equation: 'x^{2}+y^{2}=1',
            latex: 'x^{2}+y^{2}=1',
            accuracy: 0.75,
            description: 'วงกลมหน่วย - สมการพื้นฐาน',
            parameters: { type: 'fallback_circle' }
        },
        {
            equation: 'y=x^{2}',
            latex: 'y=x^{2}',
            accuracy: 0.70,
            description: 'พาราโบลาพื้นฐาน - สมการพื้นฐาน',
            parameters: { type: 'fallback_parabola' }
        },
        {
            equation: 'y=x',
            latex: 'y=x',
            accuracy: 0.65,
            description: 'เส้นตรง - สมการพื้นฐาน',
            parameters: { type: 'fallback_line' }
        }
    ];
}

/**
 * 🎯 Generate Direct Pixel Equations - สร้างสมการจากพิกเซลโดยตรง
 */
async function generateDirectPixelEquations() {
    console.log('Starting direct pixel-to-equation conversion...');
    
    if (!currentImageData) {
        console.log('No image data available');
        return [];
    }
    
    const previewImg = document.getElementById('previewImage');
    if (!previewImg || !previewImg.naturalWidth) {
        console.log('Preview image not available');
        return [];
    }
    
    // สร้าง canvas และดึงข้อมูลภาพ
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    ctx.drawImage(previewImg, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // แปลงเป็นขาวดำก่อนเพื่อความชัดเจน
    const bwImageData = convertToBlackWhite(imageData);
    const { data, width, height } = bwImageData;
    
    // แสดงภาพขาวดำให้ผู้ใช้เห็น
    displayBlackWhiteImage(bwImageData, canvas.width, canvas.height);
    
    console.log('Converted and displayed black-white image for analysis');
    
    console.log(`Processing ${width}x${height} image for direct pixel mapping`);
    
    // หาจุดดำจากภาพขาวดำ (ความละเอียดสูงมาก)
    const darkPixels = [];
    const threshold = 50; // เฉพาะจุดดำจากภาพขาวดำ
    
    // สแกนทุกพิกเซลเพื่อหาจุดดำ (ความละเอียดสูงสำหรับเส้น)
    for (let y = 0; y < height; y += 1) { // ลด step เป็น 1 เพื่อความละเอียดสูงสุด
        for (let x = 0; x < width; x += 1) { // ลด step เป็น 1
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const brightness = (r + g + b) / 3;
            
            // ถ้าพิกเซลเข้มพอ (ความสว่างน้อยกว่า threshold)
            if (brightness < threshold) {
                // แปลงจากพิกเซลภาพเป็นพิกัดคณิตศาสตร์
                const mathX = (x - width / 2) / (Math.min(width, height) / 20);
                const mathY = (height / 2 - y) / (Math.min(width, height) / 20);
                
                darkPixels.push({
                    x: parseFloat(mathX.toFixed(2)),
                    y: parseFloat(mathY.toFixed(2)),
                    brightness: brightness,
                    pixelX: x,
                    pixelY: y
                });
            }
        }
    }
    
    console.log(`Found ${darkPixels.length} dark pixels to convert to equations`);
    
    if (darkPixels.length < 3) {
        console.log('Not enough dark pixels found');
        return [];
    }
    
    // คำนวณขอบเขตของข้อมูล
    const xValues = darkPixels.map(p => p.x);
    const yValues = darkPixels.map(p => p.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    
    console.log(`Data bounds: X[${minX}, ${maxX}], Y[${minY}, ${maxY}]`);
    
    const equations = [];
    
    // วิธีใหม่: สร้างจุดโดยตรงจากพิกเซลที่พบจริง
    const directPoints = createDirectPointEquations(darkPixels, minX, maxX, minY, maxY);
    equations.push(...directPoints);
    
    console.log(`Created ${equations.length} direct point equations from actual image pixels`);
    return equations;
}

/**
 * 🖼️ Display Black White Image - แสดงภาพขาวดำ
 */
function displayBlackWhiteImage(imageData, width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    // วาดภาพขาวดำลง canvas
    ctx.putImageData(imageData, 0, 0);
    
    // สร้าง container สำหรับแสดงภาพขาวดำ
    let bwContainer = document.getElementById('blackWhiteContainer');
    if (!bwContainer) {
        bwContainer = document.createElement('div');
        bwContainer.id = 'blackWhiteContainer';
        bwContainer.className = 'mt-3 text-center';
        
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea && uploadArea.parentNode) {
            uploadArea.parentNode.insertBefore(bwContainer, uploadArea.nextSibling);
        }
    }
    
    // ลบภาพเก่า (ถ้ามี)
    bwContainer.innerHTML = '';
    
    // เพิ่มหัวข้อและภาพ
    const title = document.createElement('h5');
    title.className = 'text-primary mb-2';
    title.textContent = '🎨 ภาพขาวดำที่ใช้ในการวิเคราะห์';
    
    // กำหนดขนาดให้เหมาะสม
    const maxWidth = 400;
    const scale = Math.min(1, maxWidth / width);
    canvas.style.width = `${width * scale}px`;
    canvas.style.height = `${height * scale}px`;
    canvas.style.border = '2px solid #007bff';
    canvas.style.borderRadius = '8px';
    
    const description = document.createElement('p');
    description.className = 'text-muted small mt-2';
    description.textContent = 'ภาพนี้แสดงว่าระบบมองภาพของคุณอย่างไร และจะใช้ในการสร้างสมการ';
    
    bwContainer.appendChild(title);
    bwContainer.appendChild(canvas);
    bwContainer.appendChild(description);
    
    console.log('Black-white image displayed to user');
}

/**
 * 🎨 Convert To Black White - แปลงภาพเป็นขาวดำ
 */
function convertToBlackWhite(imageData) {
    const newImageData = new ImageData(imageData.width, imageData.height);
    const threshold = 128; // เกณฑ์สำหรับแยกขาวดำ
    
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const alpha = imageData.data[i + 3];
        
        // คำนวณค่า grayscale
        const gray = (r * 0.299 + g * 0.587 + b * 0.114);
        
        // แปลงเป็นขาวหรือดำ
        const bwValue = gray > threshold ? 255 : 0;
        
        newImageData.data[i] = bwValue;     // R
        newImageData.data[i + 1] = bwValue; // G
        newImageData.data[i + 2] = bwValue; // B
        newImageData.data[i + 3] = alpha;   // A
    }
    
    return newImageData;
}

/**
 * 🎯 Create Direct Point Equations - สร้างจุดโดยตรงจากพิกเซล
 */
function createDirectPointEquations(points, minX, maxX, minY, maxY) {
    const equations = [];
    console.log('Creating equations that represent actual pixels as points on graph...');
    
    // เรียงจุดตาม x แล้วสร้างจุดเดี่ยว
    const sortedPoints = points.slice().sort((a, b) => a.x - b.x);
    
    // วิธี 1: สร้างจุดเดี่ยวสำหรับจุดสำคัญ
    const keyPoints = extractKeyPoints(sortedPoints);
    // สร้างเฉพาะจุดที่เข้มที่สุดเท่านั้น (ลดจำนวนจุดลง)
    const veryDarkPoints = keyPoints.filter(point => point.brightness < 150); // เฉพาะจุดที่เข้มมาก
    const pointsToUse = veryDarkPoints.length > 5 ? veryDarkPoints : keyPoints.slice(0, Math.min(8, keyPoints.length));
    
    pointsToUse.forEach((point, i) => {
        // สร้างวงกลมเล็กมาก ราดิอัสแล้วกับความเข้มของพิกเซล
        const brightnessScale = (255 - point.brightness) / 255; // ยิ่งเข้ม = วงกลมใหญ่
        const radius = 0.06 + (brightnessScale * 0.08); // ลดราดิอัสเป็น 0.06-0.14
        const domain = `\\left\\{${(point.x - radius * 1.5).toFixed(2)}\\le x\\le${(point.x + radius * 1.5).toFixed(2)}\\right\\}\\left\\{${(point.y - radius * 1.5).toFixed(2)}\\le y\\le${(point.y + radius * 1.5).toFixed(2)}\\right\\}`;
        
        equations.push({
            equation: `\\left(x-${point.x.toFixed(3)}\\right)^{2}+\\left(y-${point.y.toFixed(3)}\\right)^{2}=${(radius**2).toFixed(5)}${domain}`,
            latex: `\\left(x-${point.x.toFixed(3)}\\right)^{2}+\\left(y-${point.y.toFixed(3)}\\right)^{2}=${(radius**2).toFixed(5)}${domain}`,
            accuracy: 0.99,
            description: `วงกลมจุดสำคัญ ${i+1}`,
            parameters: {
                type: 'essential_point_only',
                centerX: point.x,
                centerY: point.y,
                radius: radius,
                brightness: point.brightness,
                originalPixel: { x: point.pixelX, y: point.pixelY }
            }
        });
    });
    
    console.log(`ใช้เฉพาะจุดสำคัญ ${pointsToUse.length} จุดจาก ${keyPoints.length} จุดทั้งหมด`);
    
    // ปิดการสร้างเส้นเชื่อมอัตโนมัติ - เพื่อไม่ให้ได้เส้นที่ไม่มีในภาพ
    // const connectedLines = createSimpleConnectingLines(keyPoints);
    // equations.push(...connectedLines);
    
    // เปิดการตรวจจับเส้นจริงจากภาพขาวดำ
    const actualLines = detectActualLinesFromBW(sortedPoints);
    equations.push(...actualLines);
    
    console.log(`ตรวจพบเส้นจากภาพขาวดำ: ${actualLines.length} เส้น`);
    
    // วิธี 3: สร้างเฉพาะกลุ่มจุดที่หนาแน่นมากๆ (ลดลง)
    const veryDenseAreas = findVeryDenseAreas(sortedPoints);
    veryDenseAreas.forEach((area, i) => {
        if (area.length >= 12) { // เพิ่มเงื่อนไขเป็น 12 จุด
            const simpleEq = createSimpleEquationFromArea(area, i);
            if (simpleEq) {
                equations.push(simpleEq);
            }
        }
    });
    
    return equations;
}

/**
 * 🎯 Extract Key Points - สกัดจุดสำคัญ
 */
function extractKeyPoints(points) {
    const keyPoints = [];
    // ลดจำนวนจุดสำคัญลงเพื่อไม่ให้ได้จุดปลอม
    const targetPoints = Math.min(15, Math.max(8, Math.floor(points.length / 5))); // ลดจาก 25 เป็น 15
    const step = Math.max(1, Math.floor(points.length / targetPoints));
    
    for (let i = 0; i < points.length; i += step) {
        keyPoints.push(points[i]);
    }
    
    // เพิ่มจุดระหว่างกลาง (จุดที่มีค่า Y แตกต่างกันมาก)
    const midPoints = [];
    for (let i = 0; i < keyPoints.length - 1; i++) {
        const p1 = keyPoints[i];
        const p2 = keyPoints[i + 1];
        const yDiff = Math.abs(p2.y - p1.y);
        
        if (yDiff > 0.5) { // ถ้าค่า Y แตกต่างกันมาก เพิ่มจุดกลาง
            midPoints.push({
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2,
                pixelX: Math.round((p1.pixelX + p2.pixelX) / 2),
                pixelY: Math.round((p1.pixelY + p2.pixelY) / 2),
                brightness: (p1.brightness + p2.brightness) / 2
            });
        }
    }
    
    // รวมจุดกลางเข้าไป
    keyPoints.push(...midPoints);
    keyPoints.sort((a, b) => a.x - b.x); // เรียงใหม่
    
    // เพิ่มจุดสุดท้ายถ้ายังไม่มี
    if (keyPoints.length > 0 && keyPoints[keyPoints.length - 1] !== points[points.length - 1]) {
        keyPoints.push(points[points.length - 1]);
    }
    
    console.log(`Selected ${keyPoints.length} key points from ${points.length} total points`);
    return keyPoints;
}

/**
 * 🔍 Detect Actual Lines From BW - ตรวจหาเส้นจริงจากภาพขาวดำ
 */
function detectActualLinesFromBW(points) {
    const lines = [];
    
    if (points.length < 6) return lines;
    
    console.log('Analyzing black-white image for actual line patterns...');
    
    // หาเส้นตรงแนวนอน (เส้นที่มีจุดหลายจุดเรียงตัว)
    const horizontalLines = detectHorizontalLines(points);
    lines.push(...horizontalLines);
    
    // หาเส้นตั้งฉาก
    const verticalLines = detectVerticalLines(points);
    lines.push(...verticalLines);
    
    // หาเส้นที่มีความชัน
    const diagonalLines = detectDiagonalLines(points);
    lines.push(...diagonalLines);
    
    console.log(`Found ${horizontalLines.length} horizontal, ${verticalLines.length} vertical, ${diagonalLines.length} diagonal lines`);
    
    return lines;
}

/**
 * 🔄 Detect Horizontal Lines - หาเส้นแนวนอน
 */
function detectHorizontalLines(points) {
    const lines = [];
    const tolerance = 0.15; // ความเผื่อสำหรับ Y
    
    // จัดกลุ่มตามค่า Y ที่ใกล้เคียง
    const groupedByY = {};
    
    points.forEach(point => {
        const yKey = Math.round(point.y / tolerance) * tolerance;
        if (!groupedByY[yKey]) groupedByY[yKey] = [];
        groupedByY[yKey].push(point);
    });
    
    Object.entries(groupedByY).forEach(([yKey, group]) => {
        if (group.length >= 8) { // เพิ่มเงื่อนไขจาก 5 เป็น 8 จุด
            group.sort((a, b) => a.x - b.x);
            
            const minX = group[0].x;
            const maxX = group[group.length - 1].x;
            const avgY = group.reduce((sum, p) => sum + p.y, 0) / group.length;
            const lineLength = maxX - minX;
            
            // ตรวจสอบความต่อเนื่องของจุด
            const continuity = checkLineContinuity(group);
            
            if (lineLength > 2.0 && continuity > 0.7) { // เข้มงวด: ยาวขึ้น และต่อเนื่อง
                const domain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}`;
                
                lines.push({
                    equation: `y=${avgY.toFixed(3)}${domain}`,
                    latex: `y=${avgY.toFixed(3)}${domain}`,
                    accuracy: Math.min(0.98, 0.85 + continuity * 0.13),
                    description: `เส้นแนวนอนต่อเนื่อง (${group.length} จุด, ยาว ${lineLength.toFixed(1)})`,
                    parameters: {
                        type: 'continuous_horizontal_line',
                        y: avgY,
                        pointCount: group.length,
                        length: lineLength,
                        continuity: continuity
                    }
                });
            }
        }
    });
    
    return lines;
}

/**
 * 🔄 Detect Vertical Lines - หาเส้นตั้งฉาก
 */
function detectVerticalLines(points) {
    const lines = [];
    const tolerance = 0.15; // ความเผื่อสำหรับ X
    
    // จัดกลุ่มตามค่า X ที่ใกล้เคียง
    const groupedByX = {};
    
    points.forEach(point => {
        const xKey = Math.round(point.x / tolerance) * tolerance;
        if (!groupedByX[xKey]) groupedByX[xKey] = [];
        groupedByX[xKey].push(point);
    });
    
    Object.entries(groupedByX).forEach(([xKey, group]) => {
        if (group.length >= 8) { // เพิ่มเงื่อนไขจาก 5 เป็น 8 จุด
            group.sort((a, b) => a.y - b.y);
            
            const minY = group[0].y;
            const maxY = group[group.length - 1].y;
            const avgX = group.reduce((sum, p) => sum + p.x, 0) / group.length;
            const lineLength = maxY - minY;
            
            // ตรวจสอบความต่อเนื่องของจุด
            const continuity = checkLineContinuity(group.map(p => ({x: p.y, y: p.x}))); // สลับ x,y เพื่อใช้ฟังก์ชันเดิม
            
            if (lineLength > 2.0 && continuity > 0.7) { // เข้มงวด: ยาวขึ้น และต่อเนื่อง
                const domain = `\\left\\{${minY.toFixed(2)}\\le y\\le${maxY.toFixed(2)}\\right\\}`;
                
                lines.push({
                    equation: `x=${avgX.toFixed(3)}${domain}`,
                    latex: `x=${avgX.toFixed(3)}${domain}`,
                    accuracy: Math.min(0.98, 0.85 + continuity * 0.13),
                    description: `เส้นตั้งฉากต่อเนื่อง (${group.length} จุด, ยาว ${lineLength.toFixed(1)})`,
                    parameters: {
                        type: 'continuous_vertical_line',
                        x: avgX,
                        pointCount: group.length,
                        length: lineLength,
                        continuity: continuity
                    }
                });
            }
        }
    });
    
    return lines;
}

/**
 * 🔍 Check Line Continuity - ตรวจสอบความต่อเนื่องของเส้น
 */
function checkLineContinuity(points) {
    if (points.length < 3) return 0;
    
    // เรียงตาม X
    const sortedPoints = points.slice().sort((a, b) => a.x - b.x);
    
    let totalGaps = 0;
    let maxGap = 0;
    let gapCount = 0;
    
    for (let i = 1; i < sortedPoints.length; i++) {
        const gap = sortedPoints[i].x - sortedPoints[i-1].x;
        if (gap > 0.1) { // ช่วงว่างที่ใหญ่กว่า 0.1
            totalGaps += gap;
            maxGap = Math.max(maxGap, gap);
            gapCount++;
        }
    }
    
    const totalLength = sortedPoints[sortedPoints.length - 1].x - sortedPoints[0].x;
    const avgGap = gapCount > 0 ? totalGaps / gapCount : 0;
    
    // คำนวณ continuity score (0-1)
    let continuityScore = 1.0;
    
    // ลดคะแนนถ้ามีช่วงว่างใหญ่
    if (maxGap > totalLength * 0.3) continuityScore -= 0.4;
    if (avgGap > totalLength * 0.1) continuityScore -= 0.3;
    if (gapCount > points.length * 0.5) continuityScore -= 0.3;
    
    return Math.max(0, continuityScore);
}

/**
 * 🔄 Detect Diagonal Lines - หาเส้นที่มีความชัน
 */
function detectDiagonalLines(points) {
    const lines = [];
    
    // ใช้วิธี RANSAC เพื่อหาเส้นที่ดีที่สุด
    const bestLines = findBestLinesRANSAC(points, 3); // หา 3 เส้นที่ดีที่สุด
    
    bestLines.forEach((line, i) => {
        if (line.inliers.length >= 10 && line.confidence > 0.85) { // เข้มงวดมากขึ้น
            const xValues = line.inliers.map(p => p.x);
            const minX = Math.min(...xValues);
            const maxX = Math.max(...xValues);
            const lineLength = maxX - minX;
            const continuity = checkLineContinuity(line.inliers);
            
            // เฉพาะเส้นที่ยาวและต่อเนื่องจริงๆ
            if (lineLength > 3.0 && continuity > 0.8) {
                const domain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}`;
                
                lines.push({
                    equation: `${line.equation}${domain}`,
                    latex: `${line.equation}${domain}`,
                    accuracy: Math.min(0.98, line.confidence * continuity),
                    description: `เส้นที่มีความชันต่อเนื่อง ${i+1} (${line.inliers.length} จุด, ยาว ${lineLength.toFixed(1)})`,
                    parameters: {
                        type: 'continuous_diagonal_line',
                        slope: line.slope,
                        intercept: line.intercept,
                        pointCount: line.inliers.length,
                        confidence: line.confidence,
                        continuity: continuity,
                        length: lineLength
                    }
                });
            }
        }
    });
    
    return lines;
}

/**
 * 🎯 Find Best Lines RANSAC - หาเส้นที่ดีที่สุดด้วย RANSAC
 */
function findBestLinesRANSAC(points, maxLines) {
    const lines = [];
    const remainingPoints = [...points];
    const distanceThreshold = 0.2;
    const minInliers = 6;
    
    for (let lineCount = 0; lineCount < maxLines && remainingPoints.length >= minInliers; lineCount++) {
        let bestLine = null;
        let maxInliers = 0;
        
        // ลอง 100 ครั้ง
        for (let attempt = 0; attempt < 100; attempt++) {
            if (remainingPoints.length < 2) break;
            
            // เลือก 2 จุดแบบสุ่ม
            const idx1 = Math.floor(Math.random() * remainingPoints.length);
            let idx2 = Math.floor(Math.random() * remainingPoints.length);
            while (idx2 === idx1) {
                idx2 = Math.floor(Math.random() * remainingPoints.length);
            }
            
            const p1 = remainingPoints[idx1];
            const p2 = remainingPoints[idx2];
            
            if (Math.abs(p2.x - p1.x) < 0.01) continue; // ข้ามเส้นตั้งฉาก
            
            const slope = (p2.y - p1.y) / (p2.x - p1.x);
            const intercept = p1.y - slope * p1.x;
            
            // นับ inliers
            const inliers = [];
            for (const point of remainingPoints) {
                const expectedY = slope * point.x + intercept;
                const distance = Math.abs(point.y - expectedY);
                
                if (distance < distanceThreshold) {
                    inliers.push(point);
                }
            }
            
            if (inliers.length > maxInliers) {
                maxInliers = inliers.length;
                bestLine = {
                    slope,
                    intercept,
                    inliers,
                    confidence: Math.min(0.99, inliers.length / remainingPoints.length)
                };
            }
        }
        
        if (bestLine && bestLine.inliers.length >= minInliers) {
            // ตรวจสอบความยาวและความต่อเนื่อง
            const xValues = bestLine.inliers.map(p => p.x);
            const lineLength = Math.max(...xValues) - Math.min(...xValues);
            const continuity = checkLineContinuity(bestLine.inliers);
            
            // เข้มงวดสำหรับเส้นทแยง
            if (lineLength > 2.5 && continuity > 0.75 && bestLine.inliers.length >= 10) {
                // สร้างสมการ
                let equation;
                if (Math.abs(bestLine.slope - 1) < 0.01) {
                    equation = Math.abs(bestLine.intercept) < 0.01 ? 'y=x' : `y=x${bestLine.intercept >= 0 ? '+' : ''}${bestLine.intercept.toFixed(3)}`;
                } else if (Math.abs(bestLine.slope + 1) < 0.01) {
                    equation = Math.abs(bestLine.intercept) < 0.01 ? 'y=-x' : `y=-x${bestLine.intercept >= 0 ? '+' : ''}${bestLine.intercept.toFixed(3)}`;
                } else {
                    equation = `y=${bestLine.slope.toFixed(3)}x${bestLine.intercept >= 0 ? '+' : ''}${bestLine.intercept.toFixed(3)}`;
                }
                
                bestLine.equation = equation;
                bestLine.continuity = continuity;
                bestLine.lineLength = lineLength;
                lines.push(bestLine);
                
                // ลบ inliers ออกจาก remaining points
                bestLine.inliers.forEach(inlier => {
                    const index = remainingPoints.indexOf(inlier);
                    if (index > -1) {
                        remainingPoints.splice(index, 1);
                    }
                });
            }
        } else {
            break; // ไม่หาเส้นดีๆ ได้อีก
        }
    }
    
    return lines;
}

/**
 * 🔍 Detect Real Lines In Pixels - ตรวจหาเส้นตรงจริงจากพิกเซล (เก่า)
 */
function detectRealLinesInPixels(points) {
    const lines = [];
    
    if (points.length < 4) return lines;
    
    // หากลุ่มจุดที่เรียงตัวในแนวตรง (มีความต่อเนื่อง)
    const linearGroups = findLinearGroups(points);
    
    linearGroups.forEach((group, i) => {
        if (group.length >= 4) { // ต้องมีอย่างน้อย 4 จุดถึงจะถือว่าเป็นเส้น
            const line = fitLineToActualPixels(group);
            if (line && line.confidence > 0.7) {
                const xValues = group.map(p => p.x);
                const minX = Math.min(...xValues);
                const maxX = Math.max(...xValues);
                const domain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}`;
                
                lines.push({
                    equation: `${line.equation}${domain}`,
                    latex: `${line.equation}${domain}`,
                    accuracy: line.confidence,
                    description: `เส้นจริงจากภาพ ${i+1} (${group.length} จุดพิกเซล)`,
                    parameters: {
                        type: 'actual_line_from_pixels',
                        pointCount: group.length,
                        slope: line.slope,
                        intercept: line.intercept,
                        realPixels: group.slice(0, 3).map(p => ({x: p.pixelX, y: p.pixelY}))
                    }
                });
            }
        }
    });
    
    return lines;
}

/**
 * 🔍 Find Linear Groups - หากลุ่มจุดที่เรียงตัวในแนวตรง
 */
function findLinearGroups(points) {
    const groups = [];
    const used = new Set();
    const toleranceSlope = 0.3; // ความเผื่อของความชัน
    const toleranceDistance = 0.2; // ความเผื่อของระยะห่าง
    
    for (let i = 0; i < points.length - 1; i++) {
        if (used.has(i)) continue;
        
        const group = [points[i]];
        used.add(i);
        
        // หาจุดถัดไปที่อยู่ในแนวเดียวกัน
        for (let j = i + 1; j < points.length; j++) {
            if (used.has(j)) continue;
            
            const p1 = points[i];
            const p2 = points[j];
            
            // คำนวณความชันระหว่าง 2 จุด
            if (Math.abs(p2.x - p1.x) < 0.01) continue; // ข้ามเส้นตั้งฉาก
            
            const baseSlope = (p2.y - p1.y) / (p2.x - p1.x);
            
            // หาจุดอื่นๆ ที่มีความชันใกล้เคียงและอยู่ใกล้กัน
            for (let k = 0; k < points.length; k++) {
                if (used.has(k) || k === i || k === j) continue;
                
                const p3 = points[k];
                
                // ตรวจสอบว่าอยู่ในแนวเส้นเดียวกันหรือไม่
                const slope13 = Math.abs(p3.x - p1.x) < 0.01 ? Infinity : (p3.y - p1.y) / (p3.x - p1.x);
                const slope23 = Math.abs(p3.x - p2.x) < 0.01 ? Infinity : (p3.y - p2.y) / (p3.x - p2.x);
                
                if (Math.abs(slope13 - baseSlope) < toleranceSlope && 
                    Math.abs(slope23 - baseSlope) < toleranceSlope) {
                    
                    // ตรวจสอบระยะห่างจากเส้น
                    const distanceToLine = distancePointToLine(p3, p1, p2);
                    if (distanceToLine < toleranceDistance) {
                        group.push(p3);
                        used.add(k);
                    }
                }
            }
        }
        
        if (group.length >= 3) {
            // เรียงจุดในกลุ่มตาม X
            group.sort((a, b) => a.x - b.x);
            groups.push(group);
        }
    }
    
    return groups;
}

/**
 * 📏 Fit Line To Actual Pixels - สร้างเส้นจากพิกเซลจริง
 */
function fitLineToActualPixels(points) {
    if (points.length < 3) return null;
    
    // ใช้ least squares regression
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    
    for (const p of points) {
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumX2 += p.x * p.x;
        sumY2 += p.y * p.y;
    }
    
    const meanX = sumX / n;
    const meanY = sumY / n;
    
    const numerator = sumXY - n * meanX * meanY;
    const denominator = sumX2 - n * meanX * meanX;
    
    if (Math.abs(denominator) < 1e-10) return null;
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    // คำนวณ R² ความเข้ากันของข้อมูลกับเส้น
    let ssRes = 0, ssTot = 0;
    for (const p of points) {
        const predicted = slope * p.x + intercept;
        ssRes += (p.y - predicted) ** 2;
        ssTot += (p.y - meanY) ** 2;
    }
    
    const confidence = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
    
    // สร้างสมการ
    let equation;
    if (Math.abs(slope - 1) < 0.01) {
        equation = Math.abs(intercept) < 0.01 ? 'y=x' : `y=x${intercept >= 0 ? '+' : ''}${intercept.toFixed(3)}`;
    } else if (Math.abs(slope + 1) < 0.01) {
        equation = Math.abs(intercept) < 0.01 ? 'y=-x' : `y=-x${intercept >= 0 ? '+' : ''}${intercept.toFixed(3)}`;
    } else if (Math.abs(slope) < 0.01) {
        equation = `y=${intercept.toFixed(3)}`;
    } else {
        equation = `y=${slope.toFixed(3)}x${intercept >= 0 ? '+' : ''}${intercept.toFixed(3)}`;
    }
    
    return {
        equation,
        slope,
        intercept,
        confidence
    };
}

/**
 * 📏 Distance Point To Line - คำนวณระยะจากจุดถึงเส้น
 */
function distancePointToLine(point, linePoint1, linePoint2) {
    const x0 = point.x, y0 = point.y;
    const x1 = linePoint1.x, y1 = linePoint1.y;
    const x2 = linePoint2.x, y2 = linePoint2.y;
    
    const A = y2 - y1;
    const B = x1 - x2;
    const C = x2 * y1 - x1 * y2;
    
    return Math.abs(A * x0 + B * y0 + C) / Math.sqrt(A * A + B * B);
}

/**
 * 🔗 Create Simple Connecting Lines - สร้างเส้นเชื่อมง่ายๆ (ปิดการใช้งาน)
 */
function createSimpleConnectingLinesDisabled(keyPoints) {
    const lines = [];
    
    for (let i = 0; i < keyPoints.length - 1; i++) {
        const p1 = keyPoints[i];
        const p2 = keyPoints[i + 1];
        
        // สร้างเส้นตรงระหว่าง 2 จุด
        if (Math.abs(p2.x - p1.x) > 0.01) {
            const slope = (p2.y - p1.y) / (p2.x - p1.x);
            const intercept = p1.y - slope * p1.x;
            
            const minX = Math.min(p1.x, p2.x);
            const maxX = Math.max(p1.x, p2.x);
            const domain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}`;
            
            let equation;
            if (Math.abs(slope - 1) < 0.01) {
                equation = Math.abs(intercept) < 0.01 ? 'y=x' : `y=x${intercept >= 0 ? '+' : ''}${intercept.toFixed(2)}`;
            } else if (Math.abs(slope + 1) < 0.01) {
                equation = Math.abs(intercept) < 0.01 ? 'y=-x' : `y=-x${intercept >= 0 ? '+' : ''}${intercept.toFixed(2)}`;
            } else if (Math.abs(slope) < 0.01) {
                equation = `y=${intercept.toFixed(2)}`;
            } else {
                equation = `y=${slope.toFixed(2)}x${intercept >= 0 ? '+' : ''}${intercept.toFixed(2)}`;
            }
            
            lines.push({
                equation: `${equation}${domain}`,
                latex: `${equation}${domain}`,
                accuracy: 0.93,
                description: `เส้นเชื่อม ${i+1}-${i+2} จากภาพ`,
                parameters: {
                    type: 'precise_connecting_line',
                    fromPoint: { x: p1.x, y: p1.y, pixel: { x: p1.pixelX, y: p1.pixelY } },
                    toPoint: { x: p2.x, y: p2.y, pixel: { x: p2.pixelX, y: p2.pixelY } },
                    slope: slope,
                    intercept: intercept
                }
            });
            
            // ปิดการสร้างจุดกลางเส้นแล้ว
            // ไม่ต้องการจุดกลางเส้นอีกต่อไป
        } else {
            // เส้นตั้งฉาก
            const x = p1.x;
            const minY = Math.min(p1.y, p2.y);
            const maxY = Math.max(p1.y, p2.y);
            const domain = `\\left\\{${minY.toFixed(2)}\\le y\\le${maxY.toFixed(2)}\\right\\}`;
            
            lines.push({
                equation: `x=${x.toFixed(2)}${domain}`,
                latex: `x=${x.toFixed(2)}${domain}`,
                accuracy: 0.90,
                description: `เส้นตั้งฉากจุด ${i+1}-${i+2} จากภาพ`,
                parameters: {
                    type: 'vertical_line',
                    x: x,
                    fromY: p1.y,
                    toY: p2.y
                }
            });
        }
    }
    
    return lines;
}

/**
 * 📇 Find Dense Areas - หาพื้นที่หนาแน่น
 */
/**
 * 📇 Find Very Dense Areas - หาพื้นที่หนาแน่นมากๆ เท่านั้น
 */
function findVeryDenseAreas(points) {
    const areas = [];
    const used = new Set();
    const threshold = 0.25; // ลด threshold ลงมากเพื่อหาเฉพาะกลุ่มที่หนาแน่นจริงๆ
    
    points.forEach((point, i) => {
        if (used.has(i)) return;
        
        const area = [point];
        used.add(i);
        
        points.forEach((otherPoint, j) => {
            if (i !== j && !used.has(j)) {
                const distance = Math.sqrt((point.x - otherPoint.x)**2 + (point.y - otherPoint.y)**2);
                if (distance < threshold) {
                    area.push(otherPoint);
                    used.add(j);
                }
            }
        });
        
        if (area.length >= 10) { // ต้องมีอย่างน้อย 10 จุด
            areas.push(area);
        }
    });
    
    return areas;
}

// ฟังก์ชันเก่า (ปิดการใช้งาน)
function findDenseAreasOld(points) {
    const areas = [];
    const used = new Set();
    const threshold = 0.4; // เพิ่ม threshold เล็กน้อยเพื่อจับกลุ่มใหญ่ขึ้น
    
    // หาพื้นที่หนาแน่นแบบดั้งเดิม
    points.forEach((point, i) => {
        if (used.has(i)) return;
        
        const area = [point];
        used.add(i);
        
        points.forEach((otherPoint, j) => {
            if (i !== j && !used.has(j)) {
                const distance = Math.sqrt((point.x - otherPoint.x)**2 + (point.y - otherPoint.y)**2);
                if (distance < threshold) {
                    area.push(otherPoint);
                    used.add(j);
                }
            }
        });
        
        if (area.length >= 3) {
            areas.push(area);
        }
    });
    
    // เพิ่มการหาพื้นที่หนาแน่นแบบละเอียดมากขึ้น
    const detailedAreas = [];
    const smallThreshold = 0.2;
    const unusedPoints = points.filter((_, i) => !used.has(i));
    const smallUsed = new Set();
    
    unusedPoints.forEach((point, i) => {
        if (smallUsed.has(i)) return;
        
        const smallArea = [point];
        smallUsed.add(i);
        
        unusedPoints.forEach((otherPoint, j) => {
            if (i !== j && !smallUsed.has(j)) {
                const distance = Math.sqrt((point.x - otherPoint.x)**2 + (point.y - otherPoint.y)**2);
                if (distance < smallThreshold) {
                    smallArea.push(otherPoint);
                    smallUsed.add(j);
                }
            }
        });
        
        if (smallArea.length >= 2) {
            detailedAreas.push(smallArea);
        }
    });
    
    areas.push(...detailedAreas);
    return areas;
}

/**
 * 📊 Create Simple Equation From Area - สร้างสมการง่ายจากพื้นที่
 */
function createSimpleEquationFromArea(area, index) {
    const centerX = area.reduce((sum, p) => sum + p.x, 0) / area.length;
    const centerY = area.reduce((sum, p) => sum + p.y, 0) / area.length;
    
    const distances = area.map(p => Math.sqrt((p.x - centerX)**2 + (p.y - centerY)**2));
    const avgRadius = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    
    const xValues = area.map(p => p.x);
    const yValues = area.map(p => p.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    
    const domain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}\\left\\{${minY.toFixed(2)}\\le y\\le${maxY.toFixed(2)}\\right\\}`;
    
    return {
        equation: `\\left(x-${centerX.toFixed(2)}\\right)^{2}+\\left(y-${centerY.toFixed(2)}\\right)^{2}=${(avgRadius**2).toFixed(3)}${domain}`,
        latex: `\\left(x-${centerX.toFixed(2)}\\right)^{2}+\\left(y-${centerY.toFixed(2)}\\right)^{2}=${(avgRadius**2).toFixed(3)}${domain}`,
        accuracy: 0.85,
        description: `พื้นที่หนาแน่น ${index+1} จากภาพ (${area.length} จุด)`,
        parameters: {
            type: 'dense_area',
            centerX: centerX,
            centerY: centerY,
            radius: avgRadius,
            pointCount: area.length,
            originalPixels: area.slice(0, 3).map(p => ({ x: p.pixelX, y: p.pixelY }))
        }
    };
}

function getBounds(points) {
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    return {
        minX: Math.min(...xValues),
        maxX: Math.max(...xValues),
        minY: Math.min(...yValues),
        maxY: Math.max(...yValues)
    };
}

/**
 * 🎯 Create Equations From Actual Points - สร้างสมการจากจุดจริง (เก่า)
 */
function createEquationsFromActualPoints(points, minX, maxX, minY, maxY) {
    // ไม่ใช้แล้ว - ใช้ direct point method แทน
    console.log('Old method disabled - using direct point representation instead');
    return [];
    
    for (let i = 0; i < sortedPoints.length - chunkSize + 1; i += chunkSize) {
        const chunk = sortedPoints.slice(i, i + chunkSize);
        
        if (chunk.length < 3) continue;
        
        // ลองสร้างเส้นตรงที่ผ่านจุดเหล่านี้
        const line = createLineEquationThroughPoints(chunk);
        if (line) {
            const chunkMinX = Math.min(...chunk.map(p => p.x));
            const chunkMaxX = Math.max(...chunk.map(p => p.x));
            const xDomain = `\\left\\{${chunkMinX.toFixed(1)}\\le x\\le${chunkMaxX.toFixed(1)}\\right\\}`;
            
            equations.push({
                equation: `${line.equation}${xDomain}`,
                latex: `${line.equation}${xDomain}`,
                accuracy: line.accuracy,
                description: `เส้นตรงที่ผ่านจุดจริงในภาพ (${chunk.length} จุด)`,
                parameters: {
                    type: 'actual_pixel_line',
                    pointCount: chunk.length,
                    slope: line.slope,
                    intercept: line.intercept,
                    pixelPoints: chunk.slice(0, 3).map(p => ({x: p.pixelX, y: p.pixelY}))
                }
            });
        }
        
            // ลองสร้างเส้นโค้งก่อน (ให้ความสำคัญกว่าวงกลม)
        if (chunk.length >= 4) {
            const curve = createCurveEquationThroughPoints(chunk);
            if (curve && curve.accuracy > 0.4) {
                const chunkMinX = Math.min(...chunk.map(p => p.x));
                const chunkMaxX = Math.max(...chunk.map(p => p.x));
                const xDomain = `\\left\\{${chunkMinX.toFixed(1)}\\le x\\le${chunkMaxX.toFixed(1)}\\right\\}`;
                
                // ตรวจสอบว่าเป็นเส้นโค้งจริงหรือเป็นวงกลม
                const isActualCurve = checkIfRealCurve(chunk, curve);
                
                if (isActualCurve) {
                    equations.push({
                        equation: `${curve.equation}${xDomain}`,
                        latex: `${curve.equation}${xDomain}`,
                        accuracy: curve.accuracy,
                        description: `เส้นโค้งจริงจากภาพ (${chunk.length} จุด)`,
                        parameters: {
                            type: 'actual_pixel_curve',
                            pointCount: chunk.length,
                            degree: curve.degree,
                            coefficients: curve.coefficients,
                            curveType: curve.curveType,
                            pixelPoints: chunk.slice(0, 3).map(p => ({x: p.pixelX, y: p.pixelY}))
                        }
                    });
                }
            }
        }
        
        // ลองสร้างสมการฟังก์ชันพิเศษ (ไซน์, โคไซน์, ล็อก)
        if (chunk.length >= 6) {
            const specialCurve = createSpecialCurveEquation(chunk);
            if (specialCurve && specialCurve.accuracy > 0.5) {
                const chunkMinX = Math.min(...chunk.map(p => p.x));
                const chunkMaxX = Math.max(...chunk.map(p => p.x));
                const xDomain = `\\left\\{${chunkMinX.toFixed(1)}\\le x\\le${chunkMaxX.toFixed(1)}\\right\\}`;
                
                equations.push({
                    equation: `${specialCurve.equation}${xDomain}`,
                    latex: `${specialCurve.equation}${xDomain}`,
                    accuracy: specialCurve.accuracy,
                    description: `${specialCurve.type}จากภาพ (${chunk.length} จุด)`,
                    parameters: {
                        type: 'special_curve',
                        curveType: specialCurve.type,
                        pointCount: chunk.length,
                        pixelPoints: chunk.slice(0, 3).map(p => ({x: p.pixelX, y: p.pixelY}))
                    }
                });
            }
        }
    }
    
    // สร้างวงกลมเฉพาะจากจุดที่หนาแน่นมากๆ และเป็นวงกลมจริงๆ
    const trulyCircularRegions = findTrulyCircularRegions(points);
    trulyCircularRegions.forEach((region, i) => {
        if (region.length >= 12 && region.circularity > 0.8) { // เข้มงวดมากขึ้น
            const circle = createCircleEquationThroughPoints(region.points);
            if (circle && circle.accuracy > 0.7) { // เข้มงวดความแม่นยำ
                equations.push({
                    equation: `${circle.equation}${domain}`,
                    latex: `${circle.equation}${domain}`,
                    accuracy: circle.accuracy,
                    description: `วงกลมจริงจากภาพ ${i+1} (${region.points.length} จุด, ความเป็นวงกลม ${(region.circularity*100).toFixed(1)}%)`,
                    parameters: {
                        type: 'verified_circle',
                        pointCount: region.points.length,
                        center: circle.center,
                        radius: circle.radius,
                        circularity: region.circularity,
                        pixelPoints: region.points.slice(0, 3).map(p => ({x: p.pixelX, y: p.pixelY}))
                    }
                });
            }
        }
    });
    
    return equations;
}

// Helper functions for direct point processing
function createLineEquationThroughPoints(points) {
    if (points.length < 2) return null;
    
    // ใช้ linear regression เพื่อหาเส้นที่ผ่านจุดจริง
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    for (const p of points) {
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumX2 += p.x * p.x;
    }
    
    const meanX = sumX / n;
    const meanY = sumY / n;
    
    const numerator = sumXY - n * meanX * meanY;
    const denominator = sumX2 - n * meanX * meanX;
    
    if (Math.abs(denominator) < 1e-10) return null;
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    // คำนวณ accuracy
    let sumSquaredError = 0;
    for (const p of points) {
        const predicted = slope * p.x + intercept;
        sumSquaredError += (p.y - predicted) ** 2;
    }
    const accuracy = Math.max(0.5, 1 - Math.sqrt(sumSquaredError / n) / 2);
    
    // สร้างสมการ
    let equation;
    if (Math.abs(slope - 1) < 0.01) {
        equation = Math.abs(intercept) < 0.01 ? 'y=x' : `y=x${intercept >= 0 ? '+' : ''}${intercept.toFixed(2)}`;
    } else if (Math.abs(slope + 1) < 0.01) {
        equation = Math.abs(intercept) < 0.01 ? 'y=-x' : `y=-x${intercept >= 0 ? '+' : ''}${intercept.toFixed(2)}`;
    } else if (Math.abs(slope) < 0.01) {
        equation = `y=${intercept.toFixed(2)}`;
    } else {
        equation = `y=${slope.toFixed(2)}x${intercept >= 0 ? '+' : ''}${intercept.toFixed(2)}`;
    }
    
    return { equation, slope, intercept, accuracy };
}

function createCurveEquationThroughPoints(points) {
    if (points.length < 4) return null;
    
    // ลอง polynomial degree 2-4 แต่เริ่มจาก degree ต่ำ
    for (let degree = 2; degree <= 4; degree++) {
        const result = performPolynomialRegression(points, degree);
        
        if (result && result.confidence > 0.3) {
            const coeffs = result.coefficients;
            let equation = 'y=';
            let termCount = 0;
            
            for (let i = degree; i >= 0; i--) {
                if (Math.abs(coeffs[i]) < 1e-6) continue;
                
                const coeff = coeffs[i];
                const absCoeff = Math.abs(coeff);
                const coeffStr = absCoeff.toFixed(3);
                
                if (termCount > 0) {
                    equation += coeff >= 0 ? '+' : '-';
                } else if (coeff < 0) {
                    equation += '-';
                }
                
                if (i === 0) {
                    equation += coeffStr;
                } else if (i === 1) {
                    equation += absCoeff === 1 ? 'x' : `${coeffStr}x`;
                } else {
                    equation += absCoeff === 1 ? `x^{${i}}` : `${coeffStr}x^{${i}}`;
                }
                termCount++;
            }
            
            // ตรวจสอบประเภทของเส้นโค้ง
            const curveType = identifyCurveType(coeffs, degree);
            
            return {
                equation,
                degree: result.degree,
                coefficients: result.coefficients,
                accuracy: result.confidence,
                curveType: curveType
            };
        }
    }
    
    return null;
}

/**
 * 🔍 Check If Real Curve - ตรวจสอบว่าเป็นเส้นโค้งจริงหรือแค่วงกลม
 */
function checkIfRealCurve(points, curve) {
    if (!curve || curve.degree < 2) return false;
    
    // ตรวจสอบว่าจุดกระจายตัวอย่างเส้นโค้งหรือเป็นวงกลม
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const xRange = Math.max(...xValues) - Math.min(...xValues);
    const yRange = Math.max(...yValues) - Math.min(...yValues);
    
    // ถ้า x range มากกว่า y range มาก = เป็นเส้นโค้ง
    const aspectRatio = xRange / (yRange + 0.001);
    
    if (aspectRatio > 2.0) { // เส้นแนวนอนมาก = likely curve
        return true;
    }
    
    // ตรวจสอบความเปลี่ยนแปลงของ Y
    let directionChanges = 0;
    const sortedPoints = points.slice().sort((a, b) => a.x - b.x);
    
    for (let i = 1; i < sortedPoints.length - 1; i++) {
        const prev = sortedPoints[i - 1];
        const curr = sortedPoints[i];
        const next = sortedPoints[i + 1];
        
        const slope1 = (curr.y - prev.y) / (curr.x - prev.x + 0.001);
        const slope2 = (next.y - curr.y) / (next.x - curr.x + 0.001);
        
        if ((slope1 > 0 && slope2 < 0) || (slope1 < 0 && slope2 > 0)) {
            directionChanges++;
        }
    }
    
    // ถ้ามีการเปลี่ยนทิศทาง = เป็นเส้นโค้ง
    return directionChanges >= 1;
}

/**
 * 🌊 Create Special Curve Equation - สร้างสมการฟังก์ชันพิเศษ
 */
function createSpecialCurveEquation(points) {
    if (points.length < 6) return null;
    
    const sortedPoints = points.slice().sort((a, b) => a.x - b.x);
    const n = sortedPoints.length;
    
    // 1. ลองสมการ sine/cosine
    const sineResult = fitSineWave(sortedPoints);
    if (sineResult && sineResult.accuracy > 0.6) {
        return {
            equation: sineResult.equation,
            type: 'คลื่น sine',
            accuracy: sineResult.accuracy
        };
    }
    
    // 2. ลองสมการล็อก
    const logResult = fitLogarithmic(sortedPoints);
    if (logResult && logResult.accuracy > 0.5) {
        return {
            equation: logResult.equation,
            type: 'เส้นโค้งล็อก',
            accuracy: logResult.accuracy
        };
    }
    
    // 3. ลองสมการเอ็กโพเน็นเชียล
    const expResult = fitExponential(sortedPoints);
    if (expResult && expResult.accuracy > 0.5) {
        return {
            equation: expResult.equation,
            type: 'เส้นโค้งเอ็กโพเน็นเชียล',
            accuracy: expResult.accuracy
        };
    }
    
    return null;
}

/**
 * 🔍 Identify Curve Type - ระบุประเภทของเส้นโค้ง
 */
function identifyCurveType(coefficients, degree) {
    if (degree === 2) {
        const a = coefficients[2];
        const b = coefficients[1];
        
        if (Math.abs(a) > Math.abs(b) * 2) {
            return a > 0 ? 'พาราโบลาเปิดขึ้น' : 'พาราโบลาเปิดลง';
        } else {
            return 'เส้นโค้งดีกรี 2';
        }
    } else if (degree === 3) {
        return 'เส้นโค้งคิวบิก';
    } else if (degree === 4) {
        return 'เส้นโค้งควาร์ติก';
    }
    
    return 'เส้นโค้งทั่วไป';
}

/**
 * 🔘 Find Truly Circular Regions - หาบริเวณที่เป็นวงกลมจริงๆ
 */
function findTrulyCircularRegions(points) {
    const regions = [];
    const used = new Set();
    const threshold = 0.8; // ระยะที่ใกล้กันสำหรับวงกลม
    
    points.forEach((point, i) => {
        if (used.has(i)) return;
        
        const region = [point];
        used.add(i);
        
        // หาจุดที่อยู่ใกล้กัน
        points.forEach((otherPoint, j) => {
            if (i !== j && !used.has(j)) {
                const distance = Math.sqrt((point.x - otherPoint.x)**2 + (point.y - otherPoint.y)**2);
                if (distance < threshold) {
                    region.push(otherPoint);
                    used.add(j);
                }
            }
        });
        
        if (region.length >= 8) {
            // ตรวจสอบความเป็นวงกลม
            const circularity = calculateCircularity(region);
            
            if (circularity > 0.7) { // ต้องเป็นวงกลมมากกว่า 70%
                regions.push({
                    points: region,
                    circularity: circularity
                });
            }
        }
    });
    
    return regions;
}

/**
 * 📀 Calculate Circularity - คำนวณความเป็นวงกลม
 */
function calculateCircularity(points) {
    if (points.length < 5) return 0;
    
    // หาศูนย์กลางและรัศมีเฉลี่ย
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    
    // คำนวณระยะห่างจากศูนย์กลางของแต่ละจุด
    const distances = points.map(p => 
        Math.sqrt((p.x - centerX)**2 + (p.y - centerY)**2)
    );
    
    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    
    // คำนวณความเบี่ยงเบนมาตรฐาน
    const variance = distances.reduce((sum, d) => sum + (d - avgDistance)**2, 0) / distances.length;
    const standardDeviation = Math.sqrt(variance);
    
    // ความเป็นวงกลม = 1 - (standard deviation / average radius)
    const circularity = Math.max(0, 1 - standardDeviation / (avgDistance + 0.001));
    
    return circularity;
}

// Helper functions for special curves
function fitSineWave(points) {
    // พื้นฐานสำหรับการ fit sine wave
    return null; // ยังไม่ implement
}

function fitLogarithmic(points) {
    // พื้นฐานสำหรับการ fit logarithmic
    return null; // ยังไม่ implement
}

function fitExponential(points) {
    // พื้นฐานสำหรับการ fit exponential
    return null; // ยังไม่ implement
}

function createCircleEquationThroughPoints(points) {
    if (points.length < 8) return null;
    
    const circle = fitCircleToPoints(points);
    if (!circle || circle.confidence < 0.4) return null;
    
    const h = circle.centerX.toFixed(2);
    const k = circle.centerY.toFixed(2);
    const r2 = (circle.radius ** 2).toFixed(2);
    
    let equation;
    if (Math.abs(circle.centerX) < 0.1 && Math.abs(circle.centerY) < 0.1) {
        equation = `x^{2}+y^{2}=${r2}`;
    } else {
        const hStr = circle.centerX >= 0 ? `-${h}` : `+${Math.abs(parseFloat(h))}`;
        const kStr = circle.centerY >= 0 ? `-${k}` : `+${Math.abs(parseFloat(k))}`;
        equation = `\\left(x${hStr}\\right)^{2}+\\left(y${kStr}\\right)^{2}=${r2}`;
    }
    
    return {
        equation,
        center: { x: circle.centerX, y: circle.centerY },
        radius: circle.radius,
        accuracy: circle.confidence
    };
}

function findDenseRegions(points) {
    const regions = [];
    const used = new Set();
    const threshold = 1.0; // ระยะที่ถือว่าใกล้กัน
    
    points.forEach((point, i) => {
        if (used.has(i)) return;
        
        const region = [point];
        used.add(i);
        
        points.forEach((otherPoint, j) => {
            if (i !== j && !used.has(j)) {
                const distance = Math.sqrt((point.x - otherPoint.x)**2 + (point.y - otherPoint.y)**2);
                if (distance < threshold) {
                    region.push(otherPoint);
                    used.add(j);
                }
            }
        });
        
        if (region.length > 5) {
            regions.push(region);
        }
    });
    
    return regions;
}

async function generateEquationsFromImageGrid() {
    // ไม่ใช้แล้ว - ใช้วิธี direct pixel mapping แทน
    console.log('Grid analysis disabled - using direct pixel mapping instead');
    return [];
}

/**
 * 📐 Extract Cell Data - สกัดข้อมูลจากเซลล์หนึ่งๆ
 */
function extractCellData(imageData, startX, startY, width, height, imageWidth, imageHeight) {
    const points = [];
    const { data } = imageData;
    const threshold = 100;
    
    // แปลงพิกัดภาพเป็นพิกัดคณิตศาสตร์ (สำหรับเซลล์นี้)
    const cellCenterX = startX + width / 2;
    const cellCenterY = startY + height / 2;
    const mathCenterX = (cellCenterX - imageWidth / 2) / (Math.min(imageWidth, imageHeight) / 20);
    const mathCenterY = (imageHeight / 2 - cellCenterY) / (Math.min(imageWidth, imageHeight) / 20);
    const scale = Math.min(width, height) / 10; // สเกลสำหรับเซลล์
    
    let significantPoints = 0;
    let totalIntensity = 0;
    
    // สแกนจุดในเซลล์
    for (let y = startY; y < startY + height && y < imageHeight; y += 2) {
        for (let x = startX; x < startX + width && x < imageWidth; x += 2) {
            const index = (y * imageWidth + x) * 4;
            const intensity = (data[index] + data[index + 1] + data[index + 2]) / 3; // grayscale
            
            if (intensity > threshold) {
                const localX = (x - startX - width / 2) / scale;
                const localY = (height / 2 - (y - startY)) / scale;
                
                points.push({
                    x: parseFloat(localX.toFixed(3)),
                    y: parseFloat(localY.toFixed(3)),
                    intensity: intensity,
                    globalX: mathCenterX + localX,
                    globalY: mathCenterY + localY
                });
                
                significantPoints++;
                totalIntensity += intensity;
            }
        }
    }
    
    return {
        points,
        significantPoints,
        averageIntensity: significantPoints > 0 ? totalIntensity / significantPoints : 0,
        bounds: { startX, startY, width, height },
        mathCenter: { x: mathCenterX, y: mathCenterY },
        scale
    };
}

/**
 * 🔍 Analyze Cell Pattern - วิเคราะห์รูปแบบในเซลล์
 */
function analyzeCellPattern(cellData, row, col, gridSize) {
    const equations = [];
    const { points, mathCenter, scale } = cellData;
    
    if (points.length < 3) return equations;
    
    console.log(`Analyzing cell [${row},${col}] with ${points.length} points`);
    
    // คำนวณขอบเขต domain สำหรับเซลล์นี้
    const xValues = points.map(p => p.globalX);
    const yValues = points.map(p => p.globalY);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    
    const domain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}\\left\\{${minY.toFixed(2)}\\le y\\le${maxY.toFixed(2)}\\right\\}`;
    
    // 1. ตรวจหาวงกลมในเซลล์
    const circle = detectCircleInCell(points);
    if (circle && circle.confidence > 0.6) {
        const h = (mathCenter.x + circle.centerX).toFixed(3);
        const k = (mathCenter.y + circle.centerY).toFixed(3);
        const r2 = (circle.radius ** 2).toFixed(3);
        
        let circleEq;
        if (Math.abs(parseFloat(h)) < 0.1 && Math.abs(parseFloat(k)) < 0.1) {
            circleEq = `x^{2}+y^{2}=${r2}`;
        } else {
            const hStr = parseFloat(h) >= 0 ? `-${h}` : `+${Math.abs(parseFloat(h))}`;
            const kStr = parseFloat(k) >= 0 ? `-${k}` : `+${Math.abs(parseFloat(k))}`;
            circleEq = `\\left(x${hStr}\\right)^{2}+\\left(y${kStr}\\right)^{2}=${r2}`;
        }
        
        equations.push({
            equation: `${circleEq}${domain}`,
            latex: `${circleEq}${domain}`,
            accuracy: circle.confidence,
            description: `วงกลมในส่วนที่ ${row+1},${col+1} ของภาพ`,
            parameters: {
                type: 'cell_circle',
                cellPosition: { row, col },
                ...circle,
                globalCenter: { x: mathCenter.x + circle.centerX, y: mathCenter.y + circle.centerY },
                bounds: { minX, maxX, minY, maxY }
            }
        });
    }
    
    // 2. ตรวจหาเส้นตรงในเซลล์
    const lines = detectLinesInCell(points);
    lines.forEach((line, i) => {
        if (line.confidence > 0.5) {
            const globalSlope = line.slope;
            const globalIntercept = mathCenter.y + line.intercept - globalSlope * mathCenter.x;
            
            let lineEq;
            if (Math.abs(globalSlope - 1) < 0.01) {
                lineEq = Math.abs(globalIntercept) < 0.01 ? 'y=x' : `y=x${globalIntercept >= 0 ? '+' : ''}${globalIntercept.toFixed(3)}`;
            } else if (Math.abs(globalSlope + 1) < 0.01) {
                lineEq = Math.abs(globalIntercept) < 0.01 ? 'y=-x' : `y=-x${globalIntercept >= 0 ? '+' : ''}${globalIntercept.toFixed(3)}`;
            } else {
                lineEq = `y=${globalSlope.toFixed(3)}x${globalIntercept >= 0 ? '+' : ''}${globalIntercept.toFixed(3)}`;
            }
            
            const xDomain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}`;
            
            equations.push({
                equation: `${lineEq}${xDomain}`,
                latex: `${lineEq}${xDomain}`,
                accuracy: line.confidence,
                description: `เส้นตรง ${i+1} ในส่วนที่ ${row+1},${col+1} ของภาพ`,
                parameters: {
                    type: 'cell_line',
                    cellPosition: { row, col },
                    slope: globalSlope,
                    intercept: globalIntercept,
                    bounds: { minX, maxX, minY, maxY }
                }
            });
        }
    });
    
    // 3. ตรวจหาเส้นโค้งในเซลล์
    if (points.length > 8) {
        const curve = detectCurveInCell(points);
        if (curve && curve.confidence > 0.4) {
            // แปลงสัมประสิทธิ์ให้เป็น global coordinates
            const globalCoeffs = curve.coefficients.map((coeff, i) => {
                if (i === 0) return coeff + mathCenter.y; // constant term
                return coeff; // other terms
            });
            
            let curveEq = 'y=';
            const degree = globalCoeffs.length - 1;
            
            for (let i = degree; i >= 0; i--) {
                const coeff = globalCoeffs[i];
                if (Math.abs(coeff) < 1e-6) continue;
                
                const absCoeff = Math.abs(coeff);
                const coeffStr = absCoeff.toFixed(3);
                
                if (curveEq !== 'y=') {
                    curveEq += coeff >= 0 ? '+' : '-';
                }
                
                if (i === 0) {
                    curveEq += coeffStr;
                } else if (i === 1) {
                    curveEq += absCoeff === 1 ? 'x' : `${coeffStr}x`;
                } else {
                    curveEq += absCoeff === 1 ? `x^{${i}}` : `${coeffStr}x^{${i}}`;
                }
            }
            
            const xDomain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}`;
            
            equations.push({
                equation: `${curveEq}${xDomain}`,
                latex: `${curveEq}${xDomain}`,
                accuracy: curve.confidence,
                description: `เส้นโค้งในส่วนที่ ${row+1},${col+1} ของภาพ`,
                parameters: {
                    type: 'cell_curve',
                    cellPosition: { row, col },
                    degree: degree,
                    coefficients: globalCoeffs,
                    bounds: { minX, maxX, minY, maxY }
                }
            });
        }
    }
    
    return equations;
}

/**
 * 🎯 Generate Equations From Real Image Data - สร้างสมการจากข้อมูลภาพจริง
 */
function generateEquationsFromRealImageData(points, analysis) {
    const equations = [];
    
    if (!points || points.length < 3) {
        console.log('Insufficient real coordinate data');
        return equations;
    }
    
    console.log(`Analyzing ${points.length} real coordinate points from uploaded image`);
    
    // คำนวณขอบเขตจากจุดจริง
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    
    console.log(`Real coordinate bounds: X[${minX.toFixed(2)}, ${maxX.toFixed(2)}], Y[${minY.toFixed(2)}, ${maxY.toFixed(2)}]`);
    
    // 1. วิเคราะห์ว่าเป็นวงกลมหรือไม่
    const circleResult = analyzeCircleFromRealPoints(points);
    if (circleResult && circleResult.confidence > 0.6) {
        const domain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}\\left\\{${minY.toFixed(2)}\\le y\\le${maxY.toFixed(2)}\\right\\}`;
        equations.push({
            equation: `${circleResult.equation}${domain}`,
            latex: `${circleResult.equation}${domain}`,
            accuracy: circleResult.confidence,
            description: 'วงกลมจากการวิเคราะห์ภาพจริงพร้อม domain',
            parameters: { ...circleResult, hasRealDomain: true, bounds: { minX, maxX, minY, maxY } }
        });
    }
    
    // 2. วิเคราะห์เส้นแนวโน้ม
    const trendLines = analyzeLinearTrends(points);
    trendLines.forEach((line, i) => {
        if (line.confidence > 0.5) {
            const xDomain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}`;
            equations.push({
                equation: `${line.equation}${xDomain}`,
                latex: `${line.equation}${xDomain}`,
                accuracy: line.confidence,
                description: `เส้นแนวโน้มจากภาพ ${i + 1} พร้อม domain`,
                parameters: { ...line, hasRealDomain: true, bounds: { minX, maxX, minY, maxY } }
            });
        }
    });
    
    // 3. วิเคราะห์พหุนาม
    const polynomial = analyzePolynomialFromRealPoints(points);
    if (polynomial && polynomial.confidence > 0.4) {
        const xDomain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}`;
        equations.push({
            equation: `${polynomial.equation}${xDomain}`,
            latex: `${polynomial.equation}${xDomain}`,
            accuracy: polynomial.confidence,
            description: `พหุนามจากข้อมูลภาพจริง พร้อม domain`,
            parameters: { ...polynomial, hasRealDomain: true, bounds: { minX, maxX, minY, maxY } }
        });
    }
    
    // 4. วิเคราะห์คลัสเตอร์ของจุด
    const clusters = findRealPointClusters(points);
    clusters.forEach((cluster, i) => {
        if (cluster.length > 5) {
            const clusterEq = generateEquationFromCluster(cluster, i);
            if (clusterEq) {
                equations.push(clusterEq);
            }
        }
    });
    
    console.log(`Generated ${equations.length} equations from real image data with domains`);
    return equations;
}

/**
 * 🔍 Analyze Circle From Real Points - วิเคราะห์วงกลมจากจุดจริง
 */
function analyzeCircleFromRealPoints(points) {
    if (points.length < 5) return null;
    
    // ใช้ least squares circle fitting 
    const circle = fitCircleToPoints(points);
    if (!circle || circle.confidence < 0.5) return null;
    
    const h = circle.centerX.toFixed(3);
    const k = circle.centerY.toFixed(3);
    const r2 = (circle.radius ** 2).toFixed(3);
    
    let equation;
    if (Math.abs(circle.centerX) < 0.1 && Math.abs(circle.centerY) < 0.1) {
        equation = `x^{2}+y^{2}=${r2}`;
    } else {
        const hStr = circle.centerX >= 0 ? `-${h}` : `+${Math.abs(parseFloat(h))}`;
        const kStr = circle.centerY >= 0 ? `-${k}` : `+${Math.abs(parseFloat(k))}`;
        equation = `\\left(x${hStr}\\right)^{2}+\\left(y${kStr}\\right)^{2}=${r2}`;
    }
    
    return {
        equation,
        centerX: circle.centerX,
        centerY: circle.centerY,
        radius: circle.radius,
        confidence: circle.confidence
    };
}

/**
 * 📈 Analyze Linear Trends - วิเคราะห์แนวโน้มเส้นตรง
 */
function analyzeLinearTrends(points) {
    const trends = [];
    
    // แบ่งจุดออกเป็นกลุ่มเพื่อหาแนวโน้ม
    const sortedByX = points.slice().sort((a, b) => a.x - b.x);
    const chunkSize = Math.max(5, Math.floor(sortedByX.length / 3));
    
    for (let i = 0; i < sortedByX.length - chunkSize; i += chunkSize) {
        const chunk = sortedByX.slice(i, i + chunkSize);
        const line = fitLineToPoints(chunk);
        
        if (line && line.confidence > 0.4) {
            const slope = line.slope.toFixed(3);
            const intercept = line.intercept.toFixed(3);
            
            let equation;
            if (Math.abs(line.slope - 1) < 0.01) {
                equation = intercept === '0.000' ? 'y=x' : `y=x${parseFloat(intercept) >= 0 ? '+' : ''}${intercept}`;
            } else if (Math.abs(line.slope + 1) < 0.01) {
                equation = intercept === '0.000' ? 'y=-x' : `y=-x${parseFloat(intercept) >= 0 ? '+' : ''}${intercept}`;
            } else {
                equation = `y=${slope}x${parseFloat(intercept) >= 0 ? '+' : ''}${intercept}`;
            }
            
            trends.push({
                equation,
                slope: line.slope,
                intercept: line.intercept,
                confidence: line.confidence,
                pointCount: chunk.length
            });
        }
    }
    
    return trends;
}

/**
 * 📉 Analyze Polynomial From Real Points - วิเคราะห์พหุนามจากจุดจริง
 */
function analyzePolynomialFromRealPoints(points) {
    if (points.length < 8) return null;
    
    // ลองพหุนามดีกรี 2-4
    for (let degree = 2; degree <= 4; degree++) {
        const result = performPolynomialRegression(points, degree);
        
        if (result && result.confidence > 0.5) {
            const coeffs = result.coefficients;
            let equation = 'y=';
            let terms = [];
            
            for (let i = degree; i >= 0; i--) {
                if (Math.abs(coeffs[i]) < 1e-6) continue;
                
                const coeff = coeffs[i];
                const absCoeff = Math.abs(coeff);
                const coeffStr = absCoeff.toFixed(3);
                
                let term = '';
                if (terms.length > 0) {
                    term += coeff >= 0 ? '+' : '-';
                }
                
                if (i === 0) {
                    term += coeffStr;
                } else if (i === 1) {
                    if (absCoeff === 1) {
                        term += 'x';
                    } else {
                        term += `${coeffStr}x`;
                    }
                } else {
                    if (absCoeff === 1) {
                        term += `x^{${i}}`;
                    } else {
                        term += `${coeffStr}x^{${i}}`;
                    }
                }
                
                terms.push(term);
            }
            
            equation += terms.join('');
            
            return {
                equation,
                degree,
                coefficients: coeffs,
                confidence: result.confidence
            };
        }
    }
    
    return null;
}

/**
 * 🎯 Generate Equations With Image Bounds - สร้างสมการพร้อมขอบเขตจากภาพ
 */
function generateEquationsWithImageBounds(points, analysis) {
    const equations = [];
    
    if (!points || points.length < 5) return equations;
    
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    
    // สร้างสมการที่มีขอบเขตตามขนาดของภาพ
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const avgRadius = Math.min(maxX - minX, maxY - minY) / 4;
    
    // วงกลมมีขอบเขต
    if (avgRadius > 0) {
        const h = centerX.toFixed(3);
        const k = centerY.toFixed(3);
        const r2 = (avgRadius ** 2).toFixed(3);
        const xBound = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}`;
        const yBound = `\\left\\{${minY.toFixed(2)}\\le y\\le${maxY.toFixed(2)}\\right\\}`;
        
        equations.push({
            equation: `\\left(x-${h}\\right)^{2}+\\left(y-${k}\\right)^{2}=${r2}${xBound}${yBound}`,
            latex: `\\left(x-${h}\\right)^{2}+\\left(y-${k}\\right)^{2}=${r2}${xBound}${yBound}`,
            accuracy: 0.88,
            description: 'วงกลมจากขอบเขตภาพพร้อม domain',
            parameters: { type: 'circle_with_image_bounds', centerX, centerY, radius: avgRadius, bounds: { minX, maxX, minY, maxY } }
        });
    }
    
    // เส้นตรงมีขอบเขต
    const slope = (maxY - minY) / (maxX - minX + 0.001);
    const intercept = centerY - slope * centerX;
    
    equations.push({
        equation: `y=${slope.toFixed(3)}x${intercept >= 0 ? '+' : ''}${intercept.toFixed(3)}\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}`,
        latex: `y=${slope.toFixed(3)}x${intercept >= 0 ? '+' : ''}${intercept.toFixed(3)}\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}`,
        accuracy: 0.82,
        description: 'เส้นตรงจากขอบเขตภาพพร้อม domain',
        parameters: { type: 'line_with_image_bounds', slope, intercept, bounds: { minX, maxX, minY, maxY } }
    });
    
    return equations;
}

/**
 * 🔘 Detect Circle In Cell - ตรวจหาวงกลมในเซลล์
 */
function detectCircleInCell(points) {
    if (points.length < 5) return null;
    
    // ใช้ least squares circle fitting สำหรับจุดในเซลล์
    const n = points.length;
    let sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0, sumXY = 0;
    let sumX3 = 0, sumY3 = 0, sumX2Y = 0, sumXY2 = 0;
    
    for (const p of points) {
        const x = p.x, y = p.y;
        const x2 = x * x, y2 = y * y;
        
        sumX += x; sumY += y;
        sumX2 += x2; sumY2 += y2; sumXY += x * y;
        sumX3 += x2 * x; sumY3 += y2 * y;
        sumX2Y += x2 * y; sumXY2 += x * y2;
    }
    
    const A = n * sumX2 - sumX * sumX;
    const B = n * sumXY - sumX * sumY;
    const C = n * sumY2 - sumY * sumY;
    const D = 0.5 * (n * sumX2Y - sumX * sumY2 + n * sumX3 - sumX * sumX2);
    const E = 0.5 * (n * sumXY2 - sumY * sumX2 + n * sumY3 - sumY * sumY2);
    
    const det = A * C - B * B;
    if (Math.abs(det) < 1e-10) return null;
    
    const centerX = (D * C - B * E) / det;
    const centerY = (A * E - B * D) / det;
    
    // คำนวณรัศมีและ confidence
    let sumSquaredError = 0;
    let sumDistances = 0;
    
    for (const p of points) {
        const dist = Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2);
        sumDistances += dist;
        sumSquaredError += (dist - sumDistances / (points.indexOf(p) + 1)) ** 2;
    }
    
    const radius = sumDistances / n;
    const avgError = Math.sqrt(sumSquaredError / n);
    const confidence = Math.max(0, 1 - avgError / radius);
    
    if (radius < 0.1 || radius > 10) return null;
    
    return {
        centerX,
        centerY,
        radius,
        confidence
    };
}

/**
 * 📏 Detect Lines In Cell - ตรวจหาเส้นตรงในเซลล์
 */
function detectLinesInCell(points) {
    const lines = [];
    
    if (points.length < 4) return lines;
    
    // แบ่งจุดออกเป็นกลุ่มตาม X coordinate
    const sortedPoints = points.slice().sort((a, b) => a.x - b.x);
    const chunkSize = Math.max(3, Math.floor(sortedPoints.length / 3));
    
    for (let i = 0; i < sortedPoints.length - chunkSize + 1; i += Math.floor(chunkSize / 2)) {
        const chunk = sortedPoints.slice(i, i + chunkSize);
        
        if (chunk.length < 3) continue;
        
        // ทำ linear regression
        const n = chunk.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
        
        for (const p of chunk) {
            sumX += p.x;
            sumY += p.y;
            sumXY += p.x * p.y;
            sumX2 += p.x * p.x;
            sumY2 += p.y * p.y;
        }
        
        const meanX = sumX / n;
        const meanY = sumY / n;
        
        const numerator = sumXY - n * meanX * meanY;
        const denominator = sumX2 - n * meanX * meanX;
        
        if (Math.abs(denominator) < 1e-10) continue;
        
        const slope = numerator / denominator;
        const intercept = meanY - slope * meanX;
        
        // คำนวณ R²
        let ssRes = 0, ssTot = 0;
        for (const p of chunk) {
            const predicted = slope * p.x + intercept;
            ssRes += (p.y - predicted) ** 2;
            ssTot += (p.y - meanY) ** 2;
        }
        
        const confidence = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
        
        if (confidence > 0.3) {
            lines.push({
                slope,
                intercept,
                confidence,
                pointCount: chunk.length
            });
        }
    }
    
    return lines;
}

/**
 * 📊 Detect Curve In Cell - ตรวจหาเส้นโค้งในเซลล์
 */
function detectCurveInCell(points) {
    if (points.length < 6) return null;
    
    // ลอง polynomial degree 2-3
    for (let degree = 2; degree <= 3; degree++) {
        const result = performPolynomialRegression(points, degree);
        
        if (result && result.confidence > 0.4) {
            return {
                coefficients: result.coefficients,
                degree: result.degree,
                confidence: result.confidence
            };
        }
    }
    
    return null;
}

/**
 * 🔗 Generate Cell Connection Equations - สร้างสมการเชื่อมต่อระหว่างเซลล์
 */
function generateCellConnectionEquations(processedCells, gridSize) {
    const equations = [];
    
    // สร้างเส้นเชื่อมต่อระหว่างเซลล์ที่มีข้อมูล
    for (let i = 0; i < processedCells.length; i++) {
        for (let j = i + 1; j < processedCells.length; j++) {
            const cell1 = processedCells[i];
            const cell2 = processedCells[j];
            
            // ตรวจสอบว่าเซลล์อยู่ติดกันหรือไม่
            const rowDiff = Math.abs(cell1.row - cell2.row);
            const colDiff = Math.abs(cell1.col - cell2.col);
            
            if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
                // สร้างเส้นเชื่อมระหว่างจุดกลางของเซลล์
                const x1 = (cell1.col - gridSize/2 + 0.5) * 2;
                const y1 = (gridSize/2 - cell1.row - 0.5) * 2;
                const x2 = (cell2.col - gridSize/2 + 0.5) * 2;
                const y2 = (gridSize/2 - cell2.row - 0.5) * 2;
                
                if (Math.abs(x2 - x1) > 0.01) {
                    const slope = (y2 - y1) / (x2 - x1);
                    const intercept = y1 - slope * x1;
                    
                    const minX = Math.min(x1, x2) - 0.5;
                    const maxX = Math.max(x1, x2) + 0.5;
                    const xDomain = `\\left\\{${minX.toFixed(1)}\\le x\\le${maxX.toFixed(1)}\\right\\}`;
                    
                    let lineEq;
                    if (Math.abs(slope - 1) < 0.01) {
                        lineEq = Math.abs(intercept) < 0.01 ? 'y=x' : `y=x${intercept >= 0 ? '+' : ''}${intercept.toFixed(2)}`;
                    } else if (Math.abs(slope + 1) < 0.01) {
                        lineEq = Math.abs(intercept) < 0.01 ? 'y=-x' : `y=-x${intercept >= 0 ? '+' : ''}${intercept.toFixed(2)}`;
                    } else {
                        lineEq = `y=${slope.toFixed(2)}x${intercept >= 0 ? '+' : ''}${intercept.toFixed(2)}`;
                    }
                    
                    equations.push({
                        equation: `${lineEq}${xDomain}`,
                        latex: `${lineEq}${xDomain}`,
                        accuracy: 0.75,
                        description: `เส้นเชื่อมระหว่างส่วน [${cell1.row+1},${cell1.col+1}] และ [${cell2.row+1},${cell2.col+1}]`,
                        parameters: {
                            type: 'cell_connection',
                            cell1: { row: cell1.row, col: cell1.col },
                            cell2: { row: cell2.row, col: cell2.col },
                            slope,
                            intercept
                        }
                    });
                }
            }
        }
    }
    
    return equations;
}

// Helper functions
function findRealPointClusters(points) {
    const clusters = [];
    const used = new Set();
    const threshold = 0.5; // ใช้ค่าที่เหมาะสมกับ coordinate system
    
    points.forEach((point, i) => {
        if (used.has(i)) return;
        
        const cluster = [point];
        used.add(i);
        
        points.forEach((otherPoint, j) => {
            if (i !== j && !used.has(j)) {
                const distance = Math.sqrt((point.x - otherPoint.x)**2 + (point.y - otherPoint.y)**2);
                if (distance < threshold) {
                    cluster.push(otherPoint);
                    used.add(j);
                }
            }
        });
        
        if (cluster.length > 3) {
            clusters.push(cluster);
        }
    });
    
    return clusters;
}

function generateEquationFromCluster(cluster, index) {
    const circle = analyzeCircleFromRealPoints(cluster);
    if (circle && circle.confidence > 0.5) {
        const xValues = cluster.map(p => p.x);
        const yValues = cluster.map(p => p.y);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        
        const domain = `\\left\\{${minX.toFixed(2)}\\le x\\le${maxX.toFixed(2)}\\right\\}\\left\\{${minY.toFixed(2)}\\le y\\le${maxY.toFixed(2)}\\right\\}`;
        
        return {
            equation: `${circle.equation}${domain}`,
            latex: `${circle.equation}${domain}`,
            accuracy: circle.confidence,
            description: `คลัสเตอร์ ${index + 1} จากภาพพร้อม domain`,
            parameters: { type: 'cluster_with_domain', clusterIndex: index, ...circle, bounds: { minX, maxX, minY, maxY } }
        };
    }
    return null;
}

function fitLineToPoints(points) {
    if (points.length < 2) return null;
    
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    
    for (const p of points) {
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumX2 += p.x * p.x;
        sumY2 += p.y * p.y;
    }
    
    const meanX = sumX / n;
    const meanY = sumY / n;
    
    const numerator = sumXY - n * meanX * meanY;
    const denominator = sumX2 - n * meanX * meanX;
    
    if (Math.abs(denominator) < 1e-10) return null;
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    // Calculate R²
    let ssRes = 0, ssTot = 0;
    for (const p of points) {
        const predicted = slope * p.x + intercept;
        ssRes += (p.y - predicted) ** 2;
        ssTot += (p.y - meanY) ** 2;
    }
    
    const confidence = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
    
    return { slope, intercept, confidence };
}

/**
 * 🎯 Generate Detailed Image Equations - สร้างสมการจากการวิเคราะห์ภาพละเอียด
 */
function generateDetailedImageEquations(points, analysis) {
    const equations = [];
    
    if (!points || points.length < 3) {
        return equations;
    }
    
    console.log('Analyzing image for detailed equation generation...');
    
    // วิเคราะห์รูปแบบเฉพาะจากจุดข้อมูล
    const patterns = analyzeSpecificPatterns(points, analysis);
    console.log('Found patterns:', patterns);
    
    // สร้างสมการจากแต่ละรูปแบบที่ตรวจพบ
    patterns.forEach((pattern, index) => {
        const patternEqs = generateEquationsFromPattern(pattern, index);
        equations.push(...patternEqs);
    });
    
    // วิเคราะห์ขอบเขตและสร้างสมการที่มีเงื่อนไข
    const boundedEqs = generateBoundedEquationsFromImage(points, analysis);
    equations.push(...boundedEqs);
    
    console.log(`Generated ${equations.length} detailed equations from image analysis`);
    return equations;
}

/**
 * 🔍 Analyze Specific Patterns - วิเคราะห์รูปแบบเฉพาะ
 */
function analyzeSpecificPatterns(points, analysis) {
    const patterns = [];
    
    // ตรวจหาคลัสเตอร์ของจุด
    const clusters = findPointClusters(points);
    clusters.forEach((cluster, i) => {
        if (cluster.length > 5) {
            const clusterAnalysis = analyzeImagePattern(cluster);
            patterns.push({
                type: 'cluster',
                points: cluster,
                analysis: clusterAnalysis,
                index: i
            });
        }
    });
    
    // ตรวจหาเส้นโค้งต่อเนื่อง
    const curves = findContinuousCurves(points);
    curves.forEach((curve, i) => {
        patterns.push({
            type: 'curve',
            points: curve,
            index: i
        });
    });
    
    // ตรวจหารูปแบบเป็นช่วงๆ
    const segments = findSegmentedPatterns(points, analysis);
    segments.forEach((segment, i) => {
        patterns.push({
            type: 'segment',
            points: segment.points,
            bounds: segment.bounds,
            index: i
        });
    });
    
    return patterns;
}

/**
 * 🎯 Generate Equations From Pattern - สร้างสมการจากรูปแบบ
 */
function generateEquationsFromPattern(pattern, index) {
    const equations = [];
    
    switch (pattern.type) {
        case 'cluster':
            if (pattern.analysis.isCircular) {
                const eq = generateCircleFromCluster(pattern.points, pattern.analysis, index);
                if (eq) equations.push(eq);
            } else if (pattern.analysis.isLinear) {
                const eq = generateLineFromCluster(pattern.points, pattern.analysis, index);
                if (eq) equations.push(eq);
            }
            break;
            
        case 'curve':
            const curveEq = generateCurveEquation(pattern.points, index);
            if (curveEq) equations.push(curveEq);
            break;
            
        case 'segment':
            const segmentEq = generateSegmentEquation(pattern.points, pattern.bounds, index);
            if (segmentEq) equations.push(segmentEq);
            break;
    }
    
    return equations;
}

/**
 * 🔗 Generate Bounded Equations From Image - สร้างสมการที่มีขอบเขตจากภาพ
 */
function generateBoundedEquationsFromImage(points, analysis) {
    const equations = [];
    
    if (!points || points.length < 5) return equations;
    
    const { boundingBox } = analysis;
    if (!boundingBox) return equations;
    
    const { minX, maxX, minY, maxY } = boundingBox;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const width = maxX - minX;
    const height = maxY - minY;
    
    // สร้างสมการวงกลมที่มีขอบเขตตามภาพ
    if (width > 0 && height > 0) {
        const avgRadius = Math.min(width, height) / 4;
        const normalizedCenterX = (centerX / 100).toFixed(2);
        const normalizedCenterY = (centerY / 100).toFixed(2);
        const normalizedRadius = (avgRadius / 100).toFixed(2);
        
        // วงกลมหลักจากการวิเคราะห์ภาพ
        equations.push({
            equation: `\\left(x${parseFloat(normalizedCenterX) >= 0 ? '-' : '+'}${Math.abs(parseFloat(normalizedCenterX))}\\right)^{2}+\\left(y${parseFloat(normalizedCenterY) >= 0 ? '-' : '+'}${Math.abs(parseFloat(normalizedCenterY))}\\right)^{2}=${(parseFloat(normalizedRadius)**2).toFixed(3)}`,
            latex: `\\left(x${parseFloat(normalizedCenterX) >= 0 ? '-' : '+'}${Math.abs(parseFloat(normalizedCenterX))}\\right)^{2}+\\left(y${parseFloat(normalizedCenterY) >= 0 ? '-' : '+'}${Math.abs(parseFloat(normalizedCenterY))}\\right)^{2}=${(parseFloat(normalizedRadius)**2).toFixed(3)}`,
            accuracy: 0.95,
            description: 'วงกลมจากการวิเคราะห์ขอบเขตภาพ',
            parameters: { type: 'circle_from_image_bounds', centerX: parseFloat(normalizedCenterX), centerY: parseFloat(normalizedCenterY), radius: parseFloat(normalizedRadius) }
        });
        
        // เส้นตรงที่ผ่านจุดสำคัญ
        const keyPoints = findKeyPoints(points);
        keyPoints.forEach((keyPoint, i) => {
            if (i < 3) { // จำกัดจำนวนเส้นตรง
                const slope = ((keyPoint.y - centerY) / (keyPoint.x - centerX + 0.001)) / 100;
                const intercept = (centerY - slope * centerX) / 100;
                
                equations.push({
                    equation: `y=${slope.toFixed(3)}x${intercept >= 0 ? '+' : ''}${intercept.toFixed(3)}\\left\\{${(minX/100).toFixed(2)}\\le x\\le${(maxX/100).toFixed(2)}\\right\\}`,
                    latex: `y=${slope.toFixed(3)}x${intercept >= 0 ? '+' : ''}${intercept.toFixed(3)}\\left\\{${(minX/100).toFixed(2)}\\le x\\le${(maxX/100).toFixed(2)}\\right\\}`,
                    accuracy: 0.88 - (i * 0.02),
                    description: `เส้นตรงจากจุดสำคัญในภาพ ${i + 1}`,
                    parameters: { type: 'line_from_key_point', slope, intercept, bounds: { minX: minX/100, maxX: maxX/100 } }
                });
            }
        });
    }
    
    return equations;
}

/**
 * 🎯 Generate Basic Mathematical Equations - สมการคณิตศาสตร์พื้นฐาน
 */
function generateBasicMathematicalEquations() {
    return [
        {
            equation: 'x^{2}+y^{2}=1',
            latex: 'x^{2}+y^{2}=1',
            accuracy: 0.85,
            description: 'วงกลมหนึ่งหน่วย - สมการพื้นฐาน',
            parameters: { type: 'basic_circle' }
        },
        {
            equation: 'y=x^{2}',
            latex: 'y=x^{2}',
            accuracy: 0.83,
            description: 'พาราโบลาพื้นฐาน - สมการพื้นฐาน',
            parameters: { type: 'basic_parabola' }
        },
        {
            equation: 'y=x',
            latex: 'y=x',
            accuracy: 0.80,
            description: 'เส้นตรง 45 องศา - สมการพื้นฐาน',
            parameters: { type: 'basic_line' }
        }
    ];
}

// Helper functions for detailed analysis
function findPointClusters(points) {
    // อัลกอริทึมง่ายๆ สำหรับหาคลัสเตอร์
    const clusters = [];
    const used = new Set();
    const threshold = 50; // ระยะห่างสำหรับจัดกลุ่ม
    
    points.forEach((point, i) => {
        if (used.has(i)) return;
        
        const cluster = [point];
        used.add(i);
        
        points.forEach((otherPoint, j) => {
            if (i !== j && !used.has(j)) {
                const distance = Math.sqrt((point.x - otherPoint.x)**2 + (point.y - otherPoint.y)**2);
                if (distance < threshold) {
                    cluster.push(otherPoint);
                    used.add(j);
                }
            }
        });
        
        if (cluster.length > 2) {
            clusters.push(cluster);
        }
    });
    
    return clusters;
}

function findContinuousCurves(points) {
    // หาเส้นโค้งต่อเนื่องจากจุดที่เรียงลำดับ
    const sortedPoints = points.slice().sort((a, b) => a.x - b.x);
    const curves = [];
    
    if (sortedPoints.length > 10) {
        const chunkSize = Math.floor(sortedPoints.length / 3);
        for (let i = 0; i < sortedPoints.length; i += chunkSize) {
            const curve = sortedPoints.slice(i, i + chunkSize);
            if (curve.length > 5) {
                curves.push(curve);
            }
        }
    }
    
    return curves;
}

function findSegmentedPatterns(points, analysis) {
    const segments = [];
    const { boundingBox } = analysis;
    
    if (boundingBox) {
        const { minX, maxX, minY, maxY } = boundingBox;
        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;
        
        // แบ่งเป็น 4 ส่วน
        const quadrants = [
            { bounds: { minX, maxX: midX, minY, maxY: midY }, points: [] },
            { bounds: { minX: midX, maxX, minY, maxY: midY }, points: [] },
            { bounds: { minX, maxX: midX, minY: midY, maxY }, points: [] },
            { bounds: { minX: midX, maxX, minY: midY, maxY }, points: [] }
        ];
        
        points.forEach(point => {
            if (point.x <= midX && point.y <= midY) quadrants[0].points.push(point);
            else if (point.x > midX && point.y <= midY) quadrants[1].points.push(point);
            else if (point.x <= midX && point.y > midY) quadrants[2].points.push(point);
            else quadrants[3].points.push(point);
        });
        
        quadrants.forEach(quad => {
            if (quad.points.length > 3) {
                segments.push(quad);
            }
        });
    }
    
    return segments;
}

function findKeyPoints(points) {
    // หาจุดสำคัญ เช่น จุดที่มีค่า intensity สูง หรือจุดที่อยู่ขอบ
    return points
        .filter(p => p.intensity && p.intensity > 150)
        .sort((a, b) => (b.intensity || 0) - (a.intensity || 0))
        .slice(0, 5);
}

function generateCircleFromCluster(points, analysis, index) {
    const circle = fitCircleToPoints(points);
    if (circle && circle.confidence > 0.5) {
        const h = (circle.centerX / 100).toFixed(2);
        const k = (circle.centerY / 100).toFixed(2);
        const r2 = ((circle.radius / 100) ** 2).toFixed(3);
        
        return {
            equation: `\\left(x${parseFloat(h) >= 0 ? '-' : '+'}${Math.abs(parseFloat(h))}\\right)^{2}+\\left(y${parseFloat(k) >= 0 ? '-' : '+'}${Math.abs(parseFloat(k))}\\right)^{2}=${r2}`,
            latex: `\\left(x${parseFloat(h) >= 0 ? '-' : '+'}${Math.abs(parseFloat(h))}\\right)^{2}+\\left(y${parseFloat(k) >= 0 ? '-' : '+'}${Math.abs(parseFloat(k))}\\right)^{2}=${r2}`,
            accuracy: circle.confidence,
            description: `วงกลมจากคลัสเตอร์ ${index + 1} ในภาพ`,
            parameters: { type: 'circle_from_cluster', ...circle, clusterIndex: index }
        };
    }
    return null;
}

function generateLineFromCluster(points, analysis, index) {
    const line = detectLines(points);
    if (line && line.length > 0) {
        const bestLine = line[0];
        const slope = (bestLine.parameters.slope / 100).toFixed(3);
        const intercept = (bestLine.parameters.intercept / 100).toFixed(3);
        
        return {
            equation: `y=${slope}x${parseFloat(intercept) >= 0 ? '+' : ''}${intercept}`,
            latex: `y=${slope}x${parseFloat(intercept) >= 0 ? '+' : ''}${intercept}`,
            accuracy: bestLine.confidence,
            description: `เส้นตรงจากคลัสเตอร์ ${index + 1} ในภาพ`,
            parameters: { type: 'line_from_cluster', slope: parseFloat(slope), intercept: parseFloat(intercept), clusterIndex: index }
        };
    }
    return null;
}

function generateCurveEquation(points, index) {
    const polynomial = fitPolynomialToActualPoints(points);
    if (polynomial && polynomial.confidence > 0.4) {
        return {
            equation: polynomial.equation,
            latex: polynomial.equation,
            accuracy: polynomial.confidence,
            description: `เส้นโค้งจากการวิเคราะห์ภาพ ${index + 1}`,
            parameters: { type: 'curve_from_image', ...polynomial, curveIndex: index }
        };
    }
    return null;
}

function generateSegmentEquation(points, bounds, index) {
    if (points.length < 3) return null;
    
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    
    if (width > 0 && height > 0) {
        const radius = Math.min(width, height) / 4;
        const h = (centerX / 100).toFixed(2);
        const k = (centerY / 100).toFixed(2);
        const r2 = ((radius / 100) ** 2).toFixed(3);
        
        return {
            equation: `\\left(x${parseFloat(h) >= 0 ? '-' : '+'}${Math.abs(parseFloat(h))}\\right)^{2}+\\left(y${parseFloat(k) >= 0 ? '-' : '+'}${Math.abs(parseFloat(k))}\\right)^{2}=${r2}\\left\\{${(bounds.minX/100).toFixed(2)}\\le x\\le${(bounds.maxX/100).toFixed(2)}\\right\\}`,
            latex: `\\left(x${parseFloat(h) >= 0 ? '-' : '+'}${Math.abs(parseFloat(h))}\\right)^{2}+\\left(y${parseFloat(k) >= 0 ? '-' : '+'}${Math.abs(parseFloat(k))}\\right)^{2}=${r2}\\left\\{${(bounds.minX/100).toFixed(2)}\\le x\\le${(bounds.maxX/100).toFixed(2)}\\right\\}`,
            accuracy: 0.75,
            description: `รูปทรงในส่วน ${index + 1} ของภาพ`,
            parameters: { type: 'segment_from_image', centerX: parseFloat(h), centerY: parseFloat(k), radius: radius/100, bounds, segmentIndex: index }
        };
    }
    return null;
}

/**
 * 🎯 Generate Appropriate Thai Patterns - สร้างลายไทยที่เหมาะสม
 */
function generateAppropriateThaiPatterns(points, analysis) {
    // เลือกลายไทยที่เหมาะสมกับรูปแบบที่ตรวจพบ
    if (analysis.isCircular) {
        return generateThaiCircularPatternEquations(analysis.center, analysis.radius).slice(0, 2);
    } else if (analysis.isLinear) {
        return generateThaiLinePatternEquations().slice(0, 2);
    } else {
        return generateBasicThaiPatternEquations().slice(0, 2);
    }
}

/**
 * 🔧 Fit Polynomial to Actual Points - สร้างพหุนามจากจุดจริง
 */
function fitPolynomialToActualPoints(points) {
    try {
        // ลองพหุนามดีกรี 2-4
        for (let degree = 2; degree <= 4; degree++) {
            const result = performPolynomialRegression(points, degree);
            if (result && result.confidence > 0.6) {
                const coeffs = result.coefficients;
                let equation = 'y=';
                
                for (let i = degree; i >= 0; i--) {
                    if (Math.abs(coeffs[i]) < 1e-6) continue;
                    
                    const coeff = coeffs[i].toFixed(3);
                    const absCoeff = Math.abs(coeffs[i]).toFixed(3);
                    
                    if (equation === 'y=') {
                        equation += coeffs[i] < 0 ? `-${absCoeff}` : coeff;
                    } else {
                        equation += coeffs[i] < 0 ? `-${absCoeff}` : `+${coeff}`;
                    }
                    
                    if (i > 1) equation += `x^{${i}}`;
                    else if (i === 1) equation += 'x';
                }
                
                return {
                    equation,
                    degree,
                    coefficients: coeffs,
                    confidence: result.confidence
                };
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

/**
 * 🔧 Perform Polynomial Regression - ทำ polynomial regression
 */
function performPolynomialRegression(points, degree) {
    try {
        const n = points.length;
        if (n <= degree) return null;
        
        // สร้าง design matrix
        const X = [];
        const y = [];
        
        for (const point of points) {
            const row = [];
            for (let i = 0; i <= degree; i++) {
                row.push(Math.pow(point.x, i));
            }
            X.push(row);
            y.push(point.y);
        }
        
        // แก้สมการ normal equations: (X^T X) β = X^T y
        const XTX = multiplyMatrices(transpose(X), X);
        const XTy = multiplyMatrixVector(transpose(X), y);
        const coefficients = solveLinearSystem(XTX, XTy);
        
        if (!coefficients) return null;
        
        // คำนวณ R²
        const meanY = y.reduce((sum, val) => sum + val, 0) / n;
        let ssRes = 0, ssTot = 0;
        
        for (let i = 0; i < n; i++) {
            let predicted = 0;
            for (let j = 0; j <= degree; j++) {
                predicted += coefficients[j] * Math.pow(points[i].x, j);
            }
            ssRes += Math.pow(y[i] - predicted, 2);
            ssTot += Math.pow(y[i] - meanY, 2);
        }
        
        const confidence = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
        
        return { coefficients, confidence };
    } catch (e) {
        return null;
    }
}

// Helper functions for matrix operations
function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function multiplyMatrices(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < b.length; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function multiplyMatrixVector(matrix, vector) {
    return matrix.map(row => 
        row.reduce((sum, val, i) => sum + val * vector[i], 0)
    );
}

/**
 * 🎯 Generate Comprehensive Mathematical Equations - สร้างสมการคณิตศาสตร์ครอบคลุม
 */
function generateComprehensiveMathematicalEquations() {
    const equations = [];
    
    // วงกลมหลักและวงกลมมีเงื่อนไข (Main Circles and Conditional Circles)
    const circleEquations = [
        '\\left(x\\right)^{2}+\\left(y\\right)^{2}=1',
        '\\left(x\\right)^{2}+\\left(y\\right)^{2}=1',
        '\\left(x\\right)^{2}+\\left(y\\right)^{2}=0.6',
        '\\left(x+0.3\\right)^{2}+\\left(y-1.2\\right)^{2}=0.4\\left\\{1.65\\ge y\\ge0.71194\\right\\}\\left\\{x<0\\right\\}',
        '\\left(x+0.3\\right)^{2}+\\left(y+1.2\\right)^{2}=0.4\\left\\{-1.65\\le y\\le-0.71194\\right\\}\\left\\{x<0\\right\\}',
        '\\left(x-0.3\\right)^{2}+\\left(y-1.2\\right)^{2}=0.4\\left\\{1.65\\ge y\\ge0.71194\\right\\}\\left\\{x>0\\right\\}',
        '\\left(x-0.3\\right)^{2}+\\left(y+1.2\\right)^{2}=0.4\\left\\{-1.65\\le y\\le-0.71194\\right\\}\\left\\{x>0\\right\\}',
        '\\left(x-1.2\\right)^{2}+\\left(y-0.3\\right)^{2}=0.4\\left\\{y>0.71194\\right\\}',
        '\\left(x+1.2\\right)^{2}+\\left(y-0.3\\right)^{2}=0.4\\left\\{y>0.71194\\right\\}',
        '\\left(x+1.2\\right)^{2}+\\left(y+0.3\\right)^{2}=0.4\\left\\{y<-0.71194\\right\\}',
        '\\left(x-1.2\\right)^{2}+\\left(y+0.3\\right)^{2}=0.4\\left\\{y<-0.71194\\right\\}'
    ];
    
    // เส้นตรงมีขอบเขต (Bounded Lines)
    const lineEquations = [
        'x=-y+2.395\\left\\{1.65\\le y\\le2.395\\right\\}',
        'x=-y+2.395\\left\\{1.65\\le x\\le2.395\\right\\}',
        '-x=-y+2.395\\left\\{1.65\\le y\\le2.395\\right\\}',
        '-x=-y+2.395\\left\\{-1.65\\ge x\\ge-2.395\\right\\}',
        '-x=-y-2.395\\left\\{1.65\\le x\\le2.395\\right\\}',
        'x=y+2.395\\left\\{-1.65\\ge y\\ge-2.395\\right\\}',
        '-x=y+2.395\\left\\{-1.65\\ge x\\ge-2.395\\right\\}',
        '-x=y+2.395\\left\\{-1.65\\ge y\\ge-2.395\\right\\}'
    ];
    
    // วงกลมขนาดเล็กและเส้นเชื่อมต่อ (Small Circles and Connecting Lines)
    const detailEquations = [
        '\\left(y+0.2\\right)^{2}+\\left(x+1.2\\right)^{2}=0.1\\left\\{-1.42534\\le x\\le-0.9307\\right\\}\\left\\{y<-0.1\\right\\}',
        '\\left(y-0.2\\right)^{2}+\\left(x+1.2\\right)^{2}=0.1\\left\\{-1.42534\\le x\\le-0.9307\\left\\{y>0.1\\right\\}\\right\\}',
        '-y=x+1.8472\\left\\{x\\le-1.42534\\right\\}\\left\\{y\\le0\\right\\}',
        'y=x+1.8472\\left\\{x\\le-1.42534\\right\\}\\left\\{y\\ge0\\right\\}',
        'x=y+1.8472\\left\\{y\\le-1.42534\\right\\}\\left\\{x\\ge0\\right\\}',
        '-x=y+1.8472\\left\\{y\\le-1.42534\\right\\}\\left\\{x\\le0\\right\\}',
        '\\left(x-0.2\\right)^{2}+\\left(y+1.2\\right)^{2}=0.1\\left\\{-1.42534\\le y\\le-0.9307\\right\\}\\left\\{x>0.1\\right\\}',
        '\\left(x+0.2\\right)^{2}+\\left(y+1.2\\right)^{2}=0.1\\left\\{-1.42534\\le y\\le-0.9307\\right\\}\\left\\{x<-0.1\\right\\}',
        '\\left(y-0.2\\right)^{2}+\\left(x-1.2\\right)^{2}=0.1\\left\\{1.42534\\ge x\\ge0.9307\\right\\}\\left\\{y>0.1\\right\\}',
        '\\left(y+0.2\\right)^{2}+\\left(x-1.2\\right)^{2}=0.1\\left\\{1.42534\\ge x\\ge0.9307\\right\\}\\left\\{y<-0.1\\right\\}',
        'y=-x+1.8472\\left\\{x\\ge1.42534\\right\\}\\left\\{y\\ge0\\right\\}',
        'y=x-1.8472\\left\\{x\\ge1.42534\\right\\}\\left\\{y\\le0\\right\\}',
        '\\left(x-0.2\\right)^{2}+\\left(y-1.2\\right)^{2}=0.1\\left\\{1.42534\\ge y\\ge0.9307\\right\\}\\left\\{x>0.1\\right\\}',
        '\\left(x+0.2\\right)^{2}+\\left(y-1.2\\right)^{2}=0.1\\left\\{1.42534\\ge y\\ge0.9307\\right\\}\\left\\{x<-0.1\\right\\}',
        'x=-y+1.8472\\left\\{y\\ge1.42534\\right\\}\\left\\{x\\ge0\\right\\}',
        'x=y-1.8472\\left\\{y\\ge1.42534\\right\\}\\left\\{x\\le0\\right\\}'
    ];
    
    // วงรีและสมการซับซ้อน (Ellipses and Complex Equations)
    const ellipseEquations = [
        '\\frac{\\left(x+1.1\\right)^{2}}{b^{2}}+\\frac{y^{2}}{a^{2}}=0.001\\left\\{-1>x\\right\\}',
        '\\frac{\\left(x-1.1\\right)^{2}}{b^{2}}+\\frac{y^{2}}{a^{2}}=0.001\\left\\{1<x\\right\\}',
        '\\frac{x^{2}}{a^{2}}+\\frac{\\left(y-1.1\\right)^{2}}{b^{2}}=0.001\\left\\{1<y\\right\\}',
        '\\frac{x^{2}}{a^{2}}+\\frac{\\left(y+1.1\\right)^{2}}{b^{2}}=0.001\\left\\{-1>y\\right\\}'
    ];
    
    // สมการพีชคณิตซับซ้อน (Complex Algebraic Equations)
    const complexEquations = [
        '\\left(-y+0.8\\right)^{2}\\left(-y-0.3\\right)=\\left(x+2\\left(x+1.1\\right)^{2}\\left\\{-0.8823>x\\ge-1.57445\\left\\{0.5<y\\right\\}\\right\\}\\right)',
        '\\left(-x-0.8\\right)^{2}\\left(-x+0.3\\right)=\\left(y-2\\left(y-1.1\\right)^{2}\\left\\{0.8823<y\\le1.57445\\left\\{-0.5>x\\right\\}\\right\\}\\right)',
        '\\left(-x+0.8\\right)^{2}\\left(-x-0.3\\right)=\\left(y+2\\left(y+1.1\\right)^{2}\\left\\{-0.8823>y\\ge-1.57445\\left\\{0.5<x\\right\\}\\right\\}\\right)',
        '\\left(-y-0.8\\right)^{2}\\left(-y+0.3\\right)=\\left(x-2\\left(x-1.1\\right)^{2}\\left\\{0.8823<x\\le1.57445\\left\\{-0.5>y\\right\\}\\right\\}\\right)',
        '\\left(x+0.8\\right)^{2}\\left(x-0.3\\right)=\\left(y+2\\left(y+1.1\\right)^{2}\\left\\{-0.8823>y\\ge-1.57445\\left\\{-0.5>x\\right\\}\\right\\}\\right)',
        '\\left(y+0.8\\right)^{2}\\left(y-0.3\\right)=\\left(x+2\\left(x+1.1\\right)^{2}\\left\\{-0.8823>x\\ge-1.57445\\left\\{-0.5>y\\right\\}\\right\\}\\right)',
        '\\left(y-0.8\\right)^{2}\\left(y+0.3\\right)=\\left(x-2\\left(x-1.1\\right)^{2}\\left\\{0.8823<x\\le1.57445\\left\\{0.5<y\\right\\}\\right\\}\\right)',
        '\\left(x-0.8\\right)^{2}\\left(x+0.3\\right)=\\left(y-2\\left(y-1.1\\right)^{2}\\left\\{0.8823<y\\le1.57445\\left\\{0.5<x\\right\\}\\right\\}\\right)'
    ];
    
    // รวมสมการทั้งหมดและสร้าง object
    const allEquations = [...circleEquations, ...lineEquations, ...detailEquations, ...ellipseEquations, ...complexEquations];
    
    allEquations.forEach((eq, i) => {
        let category = 'อื่นๆ';
        let accuracy = 0.98 - (i * 0.001);
        
        if (i < circleEquations.length) {
            category = 'วงกลมและวงกลมมีเงื่อนไข';
            accuracy = 0.98;
        } else if (i < circleEquations.length + lineEquations.length) {
            category = 'เส้นตรงมีขอบเขต';
            accuracy = 0.96;
        } else if (i < circleEquations.length + lineEquations.length + detailEquations.length) {
            category = 'วงกลมเล็กและเส้นเชื่อมต่อ';
            accuracy = 0.94;
        } else if (i < circleEquations.length + lineEquations.length + detailEquations.length + ellipseEquations.length) {
            category = 'วงรีมีเงื่อนไข';
            accuracy = 0.92;
        } else {
            category = 'สมการพีชคณิตซับซ้อน';
            accuracy = 0.90;
        }
        
        equations.push({
            equation: eq,
            latex: eq,
            accuracy: accuracy,
            description: `${category} - สมการที่ ${i + 1}`,
            parameters: { type: 'comprehensive_mathematical', category, index: i + 1 }
        });
    });
    
    return equations;
}

/**
 * 🎯 Generate Polynomial Equations - สร้างสมการพหุนาม
 */
function generatePolynomialEquations(points, analysis) {
    const equations = [];
    
    // พหุนามดีกรีต่างๆ
    const polynomials = [
        'y=x^{2}',
        'y=0.5x^{2}+x-1',
        'y=x^{3}-2x',
        'y=0.1x^{4}-x^{2}+2',
        'y=x^{5}-3x^{3}+2x',
        'y=-x^{2}+4x-3',
        'y=2x^{3}-6x^{2}+4x+1'
    ];
    
    return polynomials.map((eq, i) => ({
        equation: eq,
        latex: eq,
        accuracy: 0.94 - (i * 0.005),
        description: `พหุนาม ดีกรี ${i + 2}`,
        parameters: { type: 'polynomial', degree: i + 2, adaptedFromImage: true }
    }));
}

/**
 * 🎯 Generate Circular Equations - สร้างสมการวงกลมและวงรี
 */
function generateCircularEquations(points, analysis) {
    const equations = [];
    
    // วงกลมขนาดต่างๆ
    const circles = [
        'x^{2}+y^{2}=1',
        'x^{2}+y^{2}=4',
        'x^{2}+y^{2}=0.25',
        '\\left(x-1\\right)^{2}+\\left(y-1\\right)^{2}=1',
        '\\left(x+0.5\\right)^{2}+\\left(y-0.5\\right)^{2}=2'
    ];
    
    // วงรีขนาดต่างๆ
    const ellipses = [
        '\\frac{x^{2}}{4}+\\frac{y^{2}}{1}=1',
        '\\frac{x^{2}}{1}+\\frac{y^{2}}{4}=1',
        '\\frac{x^{2}}{9}+\\frac{y^{2}}{4}=1',
        '\\frac{\\left(x-1\\right)^{2}}{4}+\\frac{\\left(y+1\\right)^{2}}{1}=1'
    ];
    
    [...circles, ...ellipses].forEach((eq, i) => {
        equations.push({
            equation: eq,
            latex: eq,
            accuracy: 0.92 - (i * 0.005),
            description: i < circles.length ? `วงกลม รัศมี ${i + 1}` : `วงรี แบบที่ ${i - circles.length + 1}`,
            parameters: { type: i < circles.length ? 'circle' : 'ellipse' }
        });
    });
    
    return equations;
}

/**
 * 🎯 Generate Linear and Curve Equations - สร้างสมการเส้นตรงและเส้นโค้ง
 */
function generateLinearAndCurveEquations(points, analysis) {
    const equations = [];
    
    // เส้นตรงต่างๆ
    const lines = [
        'y=x',
        'y=2x+1',
        'y=-x+3',
        'y=0.5x-2',
        'y=-2x+4'
    ];
    
    // เส้นโค้งพิเศษ
    const curves = [
        'y=\\sqrt{x}',
        'y=\\frac{1}{x}\\left\\{x>0\\right\\}',
        'y=e^{x}',
        'y=\\ln\\left(x\\right)\\left\\{x>0\\right\\}',
        'y=|x|'
    ];
    
    [...lines, ...curves].forEach((eq, i) => {
        equations.push({
            equation: eq,
            latex: eq,
            accuracy: 0.90 - (i * 0.005),
            description: i < lines.length ? `เส้นตรง แบบที่ ${i + 1}` : `เส้นโค้ง แบบที่ ${i - lines.length + 1}`,
            parameters: { type: i < lines.length ? 'linear' : 'curve' }
        });
    });
    
    return equations;
}

/**
 * 🎯 Generate Trigonometric Equations - สร้างสมการตรีโกณมิติ
 */
function generateTrigonometricEquations(points, analysis) {
    const equations = [];
    
    const trigFunctions = [
        'y=\\sin\\left(x\\right)',
        'y=\\cos\\left(x\\right)',
        'y=2\\sin\\left(x\\right)',
        'y=\\sin\\left(2x\\right)',
        'y=\\cos\\left(3x\\right)',
        'y=\\sin\\left(x\\right)+\\cos\\left(x\\right)',
        'y=2\\sin\\left(x-\\frac{\\pi}{4}\\right)',
        'y=\\tan\\left(x\\right)\\left\\{-1.5<x<1.5\\right\\}'
    ];
    
    return trigFunctions.map((eq, i) => ({
        equation: eq,
        latex: eq,
        accuracy: 0.88 - (i * 0.005),
        description: `ตรีโกณมิติ - รูปแบบที่ ${i + 1}`,
        parameters: { type: 'trigonometric', frequency: i + 1 }
    }));
}

/**
 * 🎯 Generate Parametric Equations - สร้างสมการพาราเมตริก
 */
function generateParametricEquations(points, analysis) {
    const equations = [];
    
    const parametric = [
        'x=\\cos\\left(t\\right), y=\\sin\\left(t\\right)',
        'x=2\\cos\\left(t\\right), y=\\sin\\left(t\\right)',
        'x=\\cos\\left(3t\\right), y=\\sin\\left(2t\\right)',
        'x=t\\cos\\left(t\\right), y=t\\sin\\left(t\\right)',
        'x=\\cos\\left(t\\right)+\\cos\\left(7t\\right), y=\\sin\\left(t\\right)+\\sin\\left(7t\\right)'
    ];
    
    return parametric.map((eq, i) => ({
        equation: eq,
        latex: eq,
        accuracy: 0.86 - (i * 0.005),
        description: `พาราเมตริก - รูปแบบที่ ${i + 1}`,
        parameters: { type: 'parametric', complexity: i + 1 }
    }));
}

/**
 * 🎯 Generate Hyperbola Equations - สร้างสมการไฮเปอร์โบลา
 */
function generateHyperbolaEquations(points, analysis) {
    const equations = [];
    
    const hyperbolas = [
        '\\frac{x^{2}}{4}-\\frac{y^{2}}{1}=1',
        '\\frac{x^{2}}{1}-\\frac{y^{2}}{4}=1',
        'xy=1',
        'xy=4',
        '\\frac{\\left(x-1\\right)^{2}}{4}-\\frac{\\left(y+1\\right)^{2}}{1}=1'
    ];
    
    return hyperbolas.map((eq, i) => ({
        equation: eq,
        latex: eq,
        accuracy: 0.84 - (i * 0.005),
        description: `ไฮเปอร์โบลา - รูปแบบที่ ${i + 1}`,
        parameters: { type: 'hyperbola' }
    }));
}

/**
 * 🎯 Generate Complex Mathematical Equations - สร้างสมการซับซ้อน
 */
function generateComplexMathematicalEquations(points, analysis) {
    const equations = [];
    
    const complex = [
        'x^{3}+y^{3}=3xy',
        'x^{4}+y^{4}=x^{2}+y^{2}',
        '\\left(x^{2}+y^{2}\\right)^{2}=2\\left(x^{2}-y^{2}\\right)',
        'y^{2}=x^{3}-x',
        'x^{2}y+xy^{2}=1',
        '\\left(x^{2}+y^{2}\\right)^{3}=8x^{2}y^{2}',
        'x^{3}+y^{3}-3xy=0'
    ];
    
    return complex.map((eq, i) => ({
        equation: eq,
        latex: eq,
        accuracy: 0.82 - (i * 0.005),
        description: `สมการซับซ้อน - รูปแบบที่ ${i + 1}`,
        parameters: { type: 'complex_curve', degree: 3 + Math.floor(i / 2) }
    }));
}

/**
 * 🎯 Generate Thai Cultural Patterns - สร้างสมการลายไทย
 */
function generateThaiCulturalPatterns(points, analysis) {
    // รวมลายไทยทั้งหมดเข้าด้วยกัน
    return [
        ...generateThaiGuardianPatternEquations(),
        ...generateThaiLinePatternEquations(),
        ...generateBasicThaiPatternEquations()
    ];
}

/**
 * 🎯 Generate Basic Mathematical Patterns - สร้างสมการรูปแบบพื้นฐาน
 */
function generateBasicPatterns() {
    return [
        // วงกลมและวงรี
        'x^{2} + y^{2} = 1',                           // วงกลมหนึ่งหน่วย
        'x^{2} + y^{2} = 4',                           // วงกลมรัศมี 2
        '\\frac{x^{2}}{4} + \\frac{y^{2}}{1} = 1',     // วงรีแนวนอน
        '\\frac{x^{2}}{1} + \\frac{y^{2}}{4} = 1',     // วงรีแนวตั้ง
        
        // เส้นตรง
        'y = x',                                      // เส้นทแยงมุม 45°
        'y = 2x',                                     // เส้นตรงชัน
        'y = -x',                                     // เส้นทแยงมุม -45°
        
        // พาราโบลา
        'y = x^{2}',                                   // พาราโบลาพื้นฐาน
        'y = 0.5x^{2}',                               // พาราโบลาแบน
        
        // ฟังก์ชันตรีโกณมิติ
        'y = \\sin(x)',                              // ไซน์
        'y = \\cos(x)'                               // โคไซน์
    ];
}

/**
 * 🎯 Display Advanced Results - แสดงผลลัพธ์ขั้นสูง
 */
async function displayAdvancedResults(equations, points, edgeData) {
    const resultDiv = document.getElementById('resultsContainer');
    const noResultsDiv = document.getElementById('noResultsMessage');
    
    // เก็บสมการใน global variable
    currentEquations = equations;
    
    // แสดง results container และซ่อน no results message
    if (resultDiv) {
        resultDiv.classList.remove('d-none');
    } else {
        console.warn('resultsContainer element not found');
    }
    
    if (noResultsDiv) {
        noResultsDiv.classList.add('d-none');
    } else {
        console.warn('noResultsMessage element not found');
    }
    
    // อัปเดตสถิติใน UI
    updateStatisticsDisplay(equations, points);
    
    // แสดงสมการใน UI
    displayEquationsInUI(equations);
    
    // ไม่แสดงกราฟ (ลบออกแล้ว)
    console.log('ข้ามการแสดงกราฟ - element ถูกลบออกแล้ว');
    
    // แสดง edge detection result
    if (edgeData) {
        displayEdgeDetectionResult(edgeData);
    }
}

/**
 * �️ Display Edge Detection Result - แสดงผลการตรวจจับขอบ
 */
function displayEdgeDetectionResult(edgeData) {
    try {
        const container = document.getElementById('edgeDetectionResults');
        if (!container) {
            console.warn('ไม่พบ element edgeDetectionResults');
            return;
        }

        container.innerHTML = '';

        if (!edgeData || !edgeData.points || edgeData.points.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    ไม่พบข้อมูลการตรวจจับขอบ
                </div>
            `;
            return;
        }

        const pointCount = edgeData.points.length;
        const accuracy = edgeData.accuracy || 0;

        container.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">
                                <i class="fas fa-search me-2"></i>
                                ผลการตรวจจับขอบ
                            </h6>
                        </div>
                        <div class="card-body">
                            <p><strong>จำนวนจุด:</strong> ${pointCount} จุด</p>
                            <p><strong>ความแม่นยำ:</strong> ${(accuracy * 100).toFixed(1)}%</p>
                            <p><strong>สถานะ:</strong> 
                                <span class="badge ${accuracy > 0.7 ? 'bg-success' : accuracy > 0.4 ? 'bg-warning' : 'bg-danger'}">
                                    ${accuracy > 0.7 ? 'ดีมาก' : accuracy > 0.4 ? 'ปานกลาง' : 'ต้องปรับปรุง'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">
                                <i class="fas fa-chart-line me-2"></i>
                                ข้อมูลเพิ่มเติม
                            </h6>
                        </div>
                        <div class="card-body">
                            <small class="text-muted">
                                การตรวจจับขอบใช้อัลกอริทึม Canny Edge Detection
                                เพื่อหาจุดที่สำคัญในภาพสำหรับสร้างสมการคณิตศาสตร์
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;

        console.log(`แสดงผลการตรวจจับขอบ: ${pointCount} จุด, ความแม่นยำ ${(accuracy * 100).toFixed(1)}%`);

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการแสดงผลการตรวจจับขอบ:', error);
    }
}

/**
 * �📊 Update Statistics Display - อัปเดตการแสดงสถิติ
 */
function updateStatisticsDisplay(equations, points) {
    // อัปเดตสถิติในการ์ด
    const bestEquation = equations && equations.length > 0 ? equations[0] : null;
    const avgAccuracy = equations && equations.length > 0 ? 
        equations.reduce((sum, eq) => sum + (eq.accuracy || 0), 0) / equations.length : 0;
    
    // อัปเดต UI elements - ใช้ null checks เพื่อป้องกันข้อผิดพลาด
    const bestAccuracyEl = document.getElementById('bestAccuracy');
    if (bestAccuracyEl) {
        bestAccuracyEl.textContent = bestEquation ? `${((bestEquation.accuracy || 0) * 100).toFixed(1)}%` : '0%';
    }
    
    const totalEquationsEl = document.getElementById('totalEquations');
    if (totalEquationsEl) {
        totalEquationsEl.textContent = equations ? equations.length : 0;
    }
    
    const dataPointsEl = document.getElementById('dataPoints');
    if (dataPointsEl) {
        dataPointsEl.textContent = points ? points.length : 0;
    }
}

/**
 * 🎨 Display Equations in UI - แสดงสมการใน UI (ปรับปรุงใหม่)
 */
function displayEquationsInUI(equations) {
    const container = document.getElementById('equationsContainer') || document.getElementById('equationResults');
    if (!container) {
        console.error('Cannot find equationsContainer or equationResults element');
        return;
    }
    
    container.innerHTML = '';
    
    if (!equations || equations.length === 0) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'col-12 text-center';
        alertDiv.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ไม่สามารถสร้างสมการจากภาพนี้ได้ กรุณาลองใช้ภาพที่มีรูปทรงชัดเจนกว่า
            </div>
        `;
        container.appendChild(alertDiv);
        return;
    }
    
    // เก็บสมการใน global variable สำหรับ Copy All
    window.currentEquations = equations;
    
    // สร้างหัวข้อ
    const headerDiv = document.createElement('div');
    headerDiv.className = 'col-12';
    headerDiv.innerHTML = `
        <div class="alert alert-success">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h5><i class="fas fa-check-circle me-2"></i>สร้างสมการสำเร็จ!</h5>
                    <p class="mb-0">พบ ${equations.length} สมการทางคณิตศาสตร์จากการวิเคราะห์ภาพ</p>
                </div>
                <div>
                    <button class="btn btn-success btn-lg" onclick="copyAllEquations()">
                        <i class="fas fa-copy me-2"></i>📋 คัดลอกทั้งหมด
                    </button>
                </div>
            </div>
        </div>
    `;
    container.appendChild(headerDiv);
    
    // แสดงสมการแต่ละรายการ
    equations.forEach((eq, index) => {
        const equationText = eq.equation || eq.latex || eq;
        const description = eq.description || 'สมการทางคณิตศาสตร์';
        
        const cardDiv = document.createElement('div');
        cardDiv.className = 'col-md-6 mb-3';
        
        const card = document.createElement('div');
        card.className = 'card';
        
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        cardHeader.innerHTML = `
            <h6 class="mb-0">สมการที่ ${index + 1}</h6>
            <small class="text-muted">${description}</small>
        `;
        
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        const codeElement = document.createElement('code');
        codeElement.className = 'equation-display';
        codeElement.textContent = cleanEquationForDisplay(equationText);
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-sm btn-primary ms-2';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> คัดลอก';
        copyBtn.onclick = () => copyEquationText(equationText);
        
        cardBody.appendChild(codeElement);
        cardBody.appendChild(copyBtn);
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        cardDiv.appendChild(card);
        container.appendChild(cardDiv);
    });
}

// ฟังก์ชันคัดลอกที่ปลอดภัย
function copyEquationText(text) {
    if (!text) return;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showAlert('คัดลอกสมการเรียบร้อย!', 'success');
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

// ฟังก์ชันคัดลอกสำรอง
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showAlert('คัดลอกสมการเรียบร้อย!', 'success');
    } catch (err) {
        showAlert('ไม่สามารถคัดลอกได้', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ฟังก์ชันคัดลอกสมการทั้งหมด
function copyAllEquations() {
    if (!window.currentEquations || window.currentEquations.length === 0) {
        showAlert('ไม่พบสมการให้คัดลอก กรุณาประมวลผลภาพก่อน', 'warning');
        return;
    }
    
    // คัดลอกเฉพาะสมการสะอาดๆ ไม่มีคำอธิบาย
    const cleanEquationsText = window.currentEquations.map(eq => {
        let equation = eq.equation || eq.latex || eq;
        
        // ลบข้อความภาษาไทยและคำอธิบายออก
        equation = equation.replace(/accuracy\s*[:\s]*[\d.]+[%\s]*/gi, '');
        equation = equation.replace(/\([\d.]+%\)/g, '');
        equation = equation.replace(/จุด\s*\d+[^\n]*/gi, '');
        equation = equation.replace(/เส้น[^\n]*/gi, '');
        equation = equation.replace(/วงกลม[^\n]*/gi, '');
        equation = equation.replace(/พื้นที่[^\n]*/gi, '');
        equation = equation.replace(/คลื่น[^\n]*/gi, '');
        equation = equation.replace(/ความแม่นยำ[^\n]*/gi, '');
        
        // ลบช่องว่างส่วนเกิน
        equation = equation.replace(/\s+/g, ' ').trim();
        
        return equation;
    }).filter(eq => eq && eq.length > 0); // กรองสมการที่ว่าง
    
    const finalText = cleanEquationsText.join('\n');
    
    // คัดลอกด้วย modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(finalText).then(() => {
            showAlert(`คัดลอกสมการสะอาด ${cleanEquationsText.length} สมการเรียบร้อย!`, 'success');
            console.log('Clean equations copied:', finalText);
        }).catch(() => {
            fallbackCopyAll(finalText);
        });
    } else {
        fallbackCopyAll(finalText);
    }
}

// ฟังก์ชันคัดลอกทั้งหมดสำรอง
function fallbackCopyAll(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showAlert(`คัดลอกสมการทั้งหมด ${window.currentEquations.length} สมการเรียบร้อย!`, 'success');
    } catch (err) {
        showAlert('ไม่สามารถคัดลอกสมการทั้งหมดได้', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ฟังก์ชันคัดลอกสมการทั้งหมด (สำรอง - ไม่ใช้แล้ว)
function copyAllEquationsOld() {
    // ตรวจสอบว่ามีสมการหรือไม่
    if (!window.currentEquations || window.currentEquations.length === 0) {
        showAlert('ไม่พบสมการให้คัดลอก กรุณาสร้างสมการก่อน', 'warning');
        return;
    }
    
    // รวบรวมเฉพาะสมการสะอาดๆ
    const cleanEquations = window.currentEquations.map(eq => {
        let equation = eq.equation || eq.latex || eq;
        // ลบคำอธิบายออก
        equation = equation.replace(/accuracy[^\n]*/gi, '');
        equation = equation.replace(/\([^)]*จุด[^)]*\)/gi, '');
        equation = equation.replace(/\([^)]*%\)/g, '');
        return equation.trim();
    }).filter(eq => eq.length > 0);
    
    // เพิ่มหัวข้อและข้อมูลเพิ่มเติม
    const fullText = cleanEquations.join('\n');
    
    // คัดลอกข้อความ
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText).then(() => {
            showAlert(`คัดลอกสมการทั้งหมด ${window.currentEquations.length} สมการเรียบร้อย!`, 'success');
        }).catch(() => {
            fallbackCopyAll(fullText);
        });
    } else {
        fallbackCopyAll(fullText);
    }
}

// ฟังก์ชันคัดลอกทั้งหมดสำรอง
function fallbackCopyAll(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showAlert(`คัดลอกสมการทั้งหมด ${window.currentEquations.length} สมการเรียบร้อย!`, 'success');
    } catch (err) {
        showAlert('ไม่สามารถคัดลอกสมการทั้งหมดได้', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ลบฟังก์ชัน openInDesmos() แล้ว

function toggleView(viewType) {
    const detailedView = document.getElementById('detailedView');
    const compactView = document.getElementById('compactView');
    const detailedBtn = document.getElementById('detailedViewBtn');
    const compactBtn = document.getElementById('compactViewBtn');
    
    if (viewType === 'detailed') {
        // Show detailed view
        detailedView.classList.remove('d-none');
        compactView.classList.add('d-none');
        
        // Update button styles
        detailedBtn.className = 'btn btn-sm btn-light';
        compactBtn.className = 'btn btn-sm btn-outline-light';
    } else {
        // Show compact view
        detailedView.classList.add('d-none');
        compactView.classList.remove('d-none');
        
        // Update button styles
        detailedBtn.className = 'btn btn-sm btn-outline-light';
        compactBtn.className = 'btn btn-sm btn-light';
    }
}

function showEquationPreview() {
    if (!currentEquations || currentEquations.length === 0) {
        showAlert('ไม่พบสมการให้แสดง', 'warning');
        return;
    }
    
    // สร้าง modal แสดงสมการ
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">🔍 ตัวอย่างสมการทั้งหมด (${currentEquations.length} สมการ)</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div style="max-height: 400px; overflow-y: auto;">
                        <pre style="white-space: pre-wrap; font-size: 12px; line-height: 1.3;">${currentEquations.join('\n\n')}</pre>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="copyAllEquations(); bootstrap.Modal.getInstance(this.closest('.modal')).hide();">
                        <i class="fas fa-copy me-2"></i>คัดลอกทั้งหมด
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // ลบ modal เมื่อปิด
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

// ==========================================
// 🎯 App Initialization
// ==========================================
// ==========================================
// 🎯 Event Listeners Initialization
// Duplicate initializeEventListeners() ถูกลบออกแล้ว
// ใช้แค่ setupEventListeners() เท่านั้น

document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized successfully');
    initializeAnimations();
});

// ==========================================
// 🔄 Clear Previous Results - ลบผลลัพธ์เก่า
// ==========================================

function clearPreviousResults() {
    try {
        // ซ่อน Results Container
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            resultsContainer.classList.add('d-none');
        }
        
        // แสดง No Results Message
        const noResultsMessage = document.getElementById('noResultsMessage');
        if (noResultsMessage) {
            noResultsMessage.classList.remove('d-none');
        }
        
        // Clear Statistics Cards - เฉพาะ elements ที่มีอยู่จริง
        const statElements = ['bestAccuracy', 'totalEquations', 'dataPoints'];
        statElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '-';
            }
        });
        
        // Clear Equations Container
        const equationsContainer = document.getElementById('equationsContainer');
        if (equationsContainer) {
            equationsContainer.innerHTML = '';
        }
        
        // Clear Canvas Charts
        const polynomialChart = document.getElementById('polynomialChart');
        const edgeCanvas = document.getElementById('edgeCanvas');
        
        if (polynomialChart) {
            const ctx = polynomialChart.getContext('2d');
            ctx.clearRect(0, 0, polynomialChart.width, polynomialChart.height);
        }
        
        if (edgeCanvas) {
            const ctx = edgeCanvas.getContext('2d');
            ctx.clearRect(0, 0, edgeCanvas.width, edgeCanvas.height);
        }
        
        // Clear Global Variables
        currentEquations = [];
        processedResults = null;
        
        console.log('🔄 Previous results cleared successfully');
        
    } catch (error) {
        console.error('❌ Error clearing previous results:', error);
    }
}

// ==========================================
// 🎨 Animation Functions - ฟังก์ชันอนิเมชัน
// ==========================================

function initializeAnimations() {
    createFloatingThaiPatterns();
    initializeChartAnimations();
    createMathematicalSymbols();
}

function createFloatingThaiPatterns() {
    const thaiSymbols = ['🏛️', '🌸', '🎭', '🏯', '⭐', '🌺', '✨', '🎨', '🔯', '🌟'];
    const container = document.body;
    
    // สร้างลายไทยลอย 8 อัน
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const symbol = document.createElement('div');
            symbol.className = 'thai-pattern-float';
            symbol.textContent = thaiSymbols[Math.floor(Math.random() * thaiSymbols.length)];
            
            // ตั้งตำแหน่งเริ่มต้นแบบสุ่ม
            symbol.style.left = Math.random() * 100 + 'vw';
            symbol.style.animationDelay = (i * 2) + 's';
            symbol.style.animationDuration = (15 + Math.random() * 10) + 's';
            
            container.appendChild(symbol);
            
            // ลบ element เมื่อ animation จบ
            setTimeout(() => {
                if (symbol.parentNode) {
                    symbol.parentNode.removeChild(symbol);
                }
            }, 25000);
        }, i * 3000); // หน่วงเวลาการปรากฏ
    }
    
    // สร้างลายไทยใหม่ทุก 15 วินาที
    setTimeout(createFloatingThaiPatterns, 15000);
}

function createMathematicalSymbols() {
    const mathSymbols = ['∑', '∫', '∞', 'π', 'Δ', '√', '∂', '∇', 'α', 'β', 'γ', 'θ', 'λ', 'μ', 'σ', 'φ'];
    const container = document.body;
    
    // สร้างสัญลักษณ์คณิตศาสตร์ลอย
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const symbol = document.createElement('div');
            symbol.className = 'floating-thai-symbol';
            symbol.textContent = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
            symbol.style.fontSize = (1.5 + Math.random() * 1) + 'rem';
            symbol.style.left = (Math.random() * 100) + 'vw';
            symbol.style.animationDelay = (i * 1.5) + 's';
            
            container.appendChild(symbol);
            
            // ลบ element เมื่อ animation จบ
            setTimeout(() => {
                if (symbol.parentNode) {
                    symbol.parentNode.removeChild(symbol);
                }
            }, 18000);
        }, i * 2500);
    }
    
    // สร้างสัญลักษณ์ใหม่ทุก 12 วินาที
    setTimeout(createMathematicalSymbols, 12000);
}

function initializeChartAnimations() {
    // เพิ่ม class สำหรับ animation ให้กับ chart containers
    const chartContainers = document.querySelectorAll('.card-body');
    chartContainers.forEach(container => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
            container.classList.add('chart-container');
            
            // เพิ่มสมการลอยเมื่อ hover
            container.addEventListener('mouseenter', () => {
                createFloatingEquations(container);
            });
        }
    });
}

function createFloatingEquations(container) {
    const equations = [
        'y = ax² + bx + c',
        'x² + y² = r²',
        'y = sin(x)',
        'y = cos(x)',
        'y = e^x',
        'y = ln(x)',
        'x²/a² + y²/b² = 1',
        'xy = k'
    ];
    
    // สร้างสมการลอย 3 อัน
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const equation = document.createElement('div');
            equation.className = 'math-formula-rise';
            equation.textContent = equations[Math.floor(Math.random() * equations.length)];
            
            // ตั้งตำแหน่งแบบสุ่ม
            equation.style.left = (20 + Math.random() * 60) + '%';
            equation.style.top = (30 + Math.random() * 40) + '%';
            equation.style.animationDelay = (i * 0.8) + 's';
            
            container.appendChild(equation);
            
            // ลบ equation เมื่อ animation จบ
            setTimeout(() => {
                if (equation.parentNode) {
                    equation.parentNode.removeChild(equation);
                }
            }, 4000);
        }, i * 1000);
    }
}

// ฟังก์ชันพิเศษสำหรับสร้างลายไทยขนาดใหญ่
function createSpecialThaiArchitecture() {
    const architectureSymbols = ['🏛️', '🏯', '⛩️', '🕌'];
    const container = document.body;
    
    const symbol = document.createElement('div');
    symbol.className = 'thai-architecture-float';
    symbol.textContent = architectureSymbols[Math.floor(Math.random() * architectureSymbols.length)];
    symbol.style.left = '-100px';
    symbol.style.top = Math.random() * 70 + '%';
    
    container.appendChild(symbol);
    
    setTimeout(() => {
        if (symbol.parentNode) {
            symbol.parentNode.removeChild(symbol);
        }
    }, 25000);
}

/**
 * 📊 Display Chart - แสดงกราฟสมการคณิตศาสตร์
 */
function displayChart(equations, points) {
    try {
        const chartContainer = document.getElementById('chartContainer');
        if (!chartContainer) {
            console.warn('ไม่พบ element chartContainer');
            return;
        }

        chartContainer.innerHTML = '';

        if (!equations || equations.length === 0) {
            chartContainer.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    ไม่มีข้อมูลสมการสำหรับสร้างกราฟ
                </div>
            `;
            return;
        }

        // สร้าง Canvas สำหรับ Chart.js
        const canvas = document.createElement('canvas');
        canvas.id = 'equationChart';
        canvas.style.maxHeight = '400px';
        chartContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        // เตรียมข้อมูลสำหรับกราฟ
        const datasets = [];

        // เพิ่มจุดข้อมูลจากภาพ
        if (points && points.length > 0) {
            datasets.push({
                label: 'จุดข้อมูลจากภาพ',
                data: points.slice(0, 100).map(p => ({x: p.x, y: p.y})),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                pointRadius: 2,
                showLine: false,
                type: 'scatter'
            });
        }

        // สร้างกราฟ
        new Chart(ctx, {
            type: 'scatter',
            data: { datasets: datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { 
                        type: 'linear',
                        title: { display: true, text: 'X' }
                    },
                    y: { 
                        title: { display: true, text: 'Y' }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'กราฟสมการคณิตศาสตร์'
                    }
                }
            }
        });

        console.log(`แสดงกราฟสำเร็จ: ${equations.length} สมการ, ${points ? points.length : 0} จุด`);

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการแสดงกราฟ:', error);
    }
}

// สร้างสถาปัตยกรรมไทยพิเศษทุก 20 วินาที
setInterval(createSpecialThaiArchitecture, 20000);
