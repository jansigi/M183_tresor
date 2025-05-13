import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {postSecret} from "../../comunication/FetchSecrets";
import "../../css/Styles.css";

/**
 * NewNote
 * @author Peter Rutschmann
 */
function NewNote({loginValues}) {
    const initialState = {
        kindid: 3,
        kind:"note",
        title: "",
        content: "",
    };
    const [noteValues, setNoteValues] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const content = noteValues;
            await postSecret({loginValues, content});
            setNoteValues(initialState);
            navigate('/secret/secrets');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="secret-form-container">
            <h2>New Note</h2>
            <form onSubmit={handleSubmit} className="note-form">
                <div className="secret-form-section">
                    <div className="secret-form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={noteValues.title}
                            onChange={(e) =>
                                setNoteValues(prevValues => ({...prevValues, title: e.target.value}))}
                            required
                            placeholder="Enter note title"
                        />
                    </div>
                    <div className="secret-form-group">
                        <label>Content</label>
                        <textarea
                            value={noteValues.content}
                            onChange={(e) =>
                                setNoteValues(prevValues =>
                                    ({...prevValues, content: e.target.value}))}
                            required
                            placeholder="Enter note content"
                        />
                    </div>
                    <div className="secret-form-actions">
                        <button type="submit">Save Note</button>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            </form>
        </div>
    );
}

export default NewNote;
