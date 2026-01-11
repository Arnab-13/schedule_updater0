
        (function() {
            'use strict';

            const form = document.getElementById('webhookTestForm');
            const resultPanel = document.getElementById('resultPanel');
            const resultContent = document.getElementById('resultContent');
            const submitButton = form.querySelector('.submit-button');

            form.addEventListener('submit', async function(event) {
                event.preventDefault();
                
                const webhookUrl = document.getElementById('webhookUrl').value.trim();
                const classId = document.getElementById('classId').value.trim();
                const action = document.getElementById('action').value;
                const subject = document.getElementById('subject').value.trim();
                const reason = document.getElementById('reason').value.trim();

                if (!webhookUrl || !classId || !action || !subject) {
                    showResult('error', '<strong>Validation Error</strong><br>Please fill in all required fields before submitting.');
                    return;
                }

                const payload = {
                    classId: classId,
                    action: action,
                    subject: subject,
                    reason: reason || 'No reason provided',
                    timestamp: new Date().toISOString(),
                    source: 'webhook-testing-suite'
                };

                setLoadingState(true);
                showResult('info', 'Sending request to webhook endpoint...');

                try {
                    const response = await fetch(webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload)
                    });

                    if (response.ok) {
                        const statusText = response.status === 200 ? 'OK' : response.statusText;
                        showResult(
                            'success',
                            '<strong>Request Successful</strong><br>' +
                            'Your webhook has been triggered successfully. Check your n8n workflow dashboard to verify execution.<br>' +
                            '<small>Response Status: ' + response.status + ' ' + statusText + '</small>'
                        );
                    } else {
                        showResult(
                            'success',
                            '<strong>Request Sent</strong><br>' +
                            'Request completed with status code ' + response.status + '. Your workflow may still process this successfully.<br>' +
                            '<small>Tip: Verify in your n8n workflow logs</small>'
                        );
                    }
                } catch (error) {
                    showResult(
                        'error',
                        '<strong>Connection Failed</strong><br>' +
                        error.message +
                        '<ul>' +
                        '<li>Ensure your n8n workflow is active and listening</li>' +
                        '<li>Verify the webhook URL is correct</li>' +
                        '<li>Check for CORS restrictions if testing locally</li>' +
                        '<li>Confirm network connectivity to your n8n instance</li>' +
                        '</ul>'
                    );
                } finally {
                    setLoadingState(false);
                }
            });

            function showResult(type, message) {
                resultPanel.className = 'result-panel result-panel--visible';
                
                if (type === 'success') {
                    resultPanel.classList.add('result-panel--success');
                } else if (type === 'error') {
                    resultPanel.classList.add('result-panel--error');
                }
                
                resultContent.innerHTML = message;
                
                resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            function setLoadingState(isLoading) {
                if (isLoading) {
                    submitButton.disabled = true;
                    submitButton.classList.add('submit-button--loading');
                    submitButton.textContent = '';
                } else {
                    submitButton.disabled = false;
                    submitButton.classList.remove('submit-button--loading');
                    submitButton.textContent = 'Send Test Request';
                }
            }
        })();
