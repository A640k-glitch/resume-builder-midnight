document.addEventListener('DOMContentLoaded', () => {
    // Select inputs
    const nameInput = document.getElementById('fullName');
    const titleInput = document.getElementById('jobTitle');
    const summaryInput = document.getElementById('summary');
    const cvUpload = document.getElementById('cvUpload');
    
    // Select preview elements
    const resumePreview = document.getElementById('resumePreview');
    const prevName = document.getElementById('prevName');
    const prevTitle = document.getElementById('prevTitle');
    const prevSummary = document.getElementById('prevSummary');
    
    // Update live preview
    const updatePreview = () => {
        prevName.textContent = nameInput.value || 'Your Name';
        prevTitle.textContent = titleInput.value || 'Your Title';
        prevSummary.textContent = summaryInput.value || 'Your professional summary will appear here.';
    };

    nameInput.addEventListener('input', updatePreview);
    titleInput.addEventListener('input', updatePreview);
    summaryInput.addEventListener('input', updatePreview);

    // Handle File Upload (Basic Text Parsing)
    cvUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type === "text/plain") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                // In a real app, you'd need logic to split this text into Name, Title, etc.
                // For demonstration, we'll dump it into the summary so the user doesn't lose their data.
                summaryInput.value = text;
                updatePreview();
                alert('Text loaded! Please format it into the correct fields.');
            };
            reader.readAsText(file);
        } else {
            alert('For this demo, please upload a .txt file.');
        }
    });

    // Handle PDF Generation
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    
    downloadPdfBtn.addEventListener('click', () => {
        // Temporarily add a class to make the preview look like a white paper document
        resumePreview.classList.add('pdf-export-mode');

        // Configure PDF options
        const opt = {
            margin:       0,
            filename:     'Optimized_Resume.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 }, // Higher scale for better text resolution
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Generate PDF
        html2pdf().set(opt).from(resumePreview).save().then(() => {
            // Remove the white paper styling after download to return to the dark UI
            resumePreview.classList.remove('pdf-export-mode');
        });
    });
});
