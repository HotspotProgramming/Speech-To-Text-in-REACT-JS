import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Form, Alert } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = event => {
        const lastResultIndex = event.results.length - 1;
        if (event.results[lastResultIndex].isFinal) {
          const finalTranscript = event.results[lastResultIndex][0].transcript;
          setTranscript(prev => `${prev} ${finalTranscript}`);
        }
      };

      recognitionRef.current.onerror = event => {
        setError(event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      alert(
        "Browser is not supporting WEB SPEECH API. Please use GOOGLE CHROME"
      );
    }
  }, []);
  const startLisining = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };
  const stopLisining = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  return (
    <Container>
      <div>
        <Button
          variant="primary"
          onClick={startLisining}
          disabled={isListening}
          className="me-2"
        >
          Start Listening
        </Button>
        <Button
          variant="danger"
          onClick={stopLisining}
          disabled={!isListening}
          className="me-2"
        >
          Stop Listening
        </Button>
      </div>
      <Form.Group>
        <Form.Label>
          <strong>transcript: </strong>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          value={transcript}
          readOnly
        ></Form.Control>
      </Form.Group>

      {error && (
        <Alert variant="danger" className="mt-3">
          Error: {error}
        </Alert>
      )}
    </Container>
  );
}

export default App;
