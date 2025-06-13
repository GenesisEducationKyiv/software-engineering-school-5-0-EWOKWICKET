document.getElementById('subscribe-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const result = document.getElementById('result');
  result.textContent = 'Loading…';

  const email = document.getElementById('email').value;
  const city = document.getElementById('city').value;
  const frequency = document.getElementById('frequency').value;

  const payload = { email, city, frequency };

  try {
    const response = await fetch('/weatherapi.app/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      result.textContent = 'Confirmation mail sent. Check you mailbox';
    } else {
      const data = await response.json();
      let message = data.message;
      if (data.possibleLocations) message += `\nPossible locations: ${data.possibleLocations.join(', ')}`;
      result.textContent = message;
    }
  } catch (error) {
    console.error(error);
    result.textContent = 'An error occurred.';
  }
});
