# Requirements Document

## Introduction

The HTML Playground is a browser-based code editor that enables users to write HTML, CSS, and JavaScript with live preview capabilities. Users can share their code snippets globally via unique URLs without requiring authentication. The system supports both single-file HTML editing and multi-file projects with separate HTML, CSS, and JavaScript files.

## Glossary

- **Editor**: The Monaco-based code editing component where users write HTML, CSS, and JavaScript
- **Preview_Pane**: The sandboxed iframe that displays the rendered output of user code
- **Snippet**: A saved collection of HTML, CSS, and JavaScript code with a unique identifier
- **Share_URL**: A globally accessible URL that loads a specific snippet
- **Storage_Service**: The Supabase database that persists snippets
- **Local_Draft**: Code temporarily saved in browser localStorage before sharing
- **Split_Pane**: The resizable layout dividing the Editor and Preview_Pane
- **Mode**: Either single-file (HTML only) or multi-file (HTML/CSS/JS tabs)

## Requirements

### Requirement 1: Code Editing

**User Story:** As a developer, I want to write HTML, CSS, and JavaScript in a code editor, so that I can create web snippets quickly.

#### Acceptance Criteria

1. THE Editor SHALL support syntax highlighting for HTML, CSS, and JavaScript
2. THE Editor SHALL support code completion for HTML, CSS, and JavaScript
3. THE Editor SHALL support line numbers and code folding
4. WHEN a user types code, THE Editor SHALL update the content in real-time
5. THE Editor SHALL support standard keyboard shortcuts for undo, redo, copy, paste, and find

### Requirement 2: Live Preview

**User Story:** As a developer, I want to see my code rendered in real-time, so that I can iterate quickly without manual refresh.

#### Acceptance Criteria

1. WHEN code content changes, THE Preview_Pane SHALL update within 500ms
2. THE Preview_Pane SHALL render HTML, CSS, and JavaScript in a sandboxed iframe
3. THE Preview_Pane SHALL isolate user code execution with allow-scripts permission only
4. THE Preview_Pane SHALL prevent same-origin access to protect the parent application
5. IF user code contains runtime errors, THE Preview_Pane SHALL display the error in the browser console without crashing the application

### Requirement 3: Editor Modes

**User Story:** As a developer, I want to choose between single-file and multi-file editing modes, so that I can work with simple HTML or separated concerns.

#### Acceptance Criteria

1. THE Editor SHALL support single-file mode with HTML only
2. THE Editor SHALL support multi-file mode with separate HTML, CSS, and JavaScript tabs
3. WHEN in multi-file mode, THE Editor SHALL display tabs for switching between HTML, CSS, and JavaScript
4. WHEN in single-file mode, THE Editor SHALL allow inline CSS and JavaScript within the HTML
5. WHEN switching modes, THE Editor SHALL preserve existing code content
6. WHEN in multi-file mode and rendering preview, THE System SHALL combine HTML, CSS, and JavaScript into a single document

### Requirement 4: Snippet Persistence

**User Story:** As a developer, I want my snippets saved to a database, so that I can share them globally via URL.

#### Acceptance Criteria

1. WHEN a user clicks Share, THE System SHALL save the snippet to the Storage_Service
2. THE System SHALL generate a unique identifier for each saved snippet
3. THE System SHALL store HTML content, CSS content, JavaScript content, mode type, and creation timestamp
4. THE System SHALL enforce a 500KB maximum payload size for each snippet
5. IF the payload exceeds 500KB, THEN THE System SHALL display an error message and prevent saving
6. WHEN a snippet is saved, THE System SHALL return a Share_URL containing the unique identifier

### Requirement 5: Snippet Sharing

**User Story:** As a developer, I want to share my code via a URL, so that anyone can view and edit it without authentication.

#### Acceptance Criteria

1. WHEN a user accesses a Share_URL, THE System SHALL load the snippet from the Storage_Service
2. THE System SHALL populate the Editor with the snippet's HTML, CSS, and JavaScript content
3. THE System SHALL set the Editor mode based on the snippet's saved mode type
4. THE System SHALL render the snippet in the Preview_Pane
5. IF the snippet identifier does not exist, THEN THE System SHALL display a "Snippet not found" message
6. THE System SHALL allow any user to view and edit loaded snippets without authentication

### Requirement 6: Local Draft Auto-Save

**User Story:** As a developer, I want my work saved locally, so that I don't lose progress if I accidentally close the browser.

#### Acceptance Criteria

1. WHEN code content changes, THE System SHALL save the Local_Draft to browser localStorage within 1 second
2. THE System SHALL save HTML content, CSS content, JavaScript content, and mode type to localStorage
3. WHEN a user opens the application without a snippet identifier, THE System SHALL load the Local_Draft from localStorage
4. WHEN a user successfully shares a snippet, THE System SHALL clear the Local_Draft from localStorage
5. THE System SHALL store only the most recent Local_Draft

### Requirement 7: File Upload

**User Story:** As a developer, I want to upload an HTML file, so that I can edit and share existing code.

#### Acceptance Criteria

1. THE System SHALL provide a file upload button
2. WHEN a user clicks the upload button, THE System SHALL open a file picker dialog
3. THE System SHALL accept files with .html, .htm, .css, and .js extensions
4. WHEN a user selects an HTML file, THE System SHALL load the file content into the Editor
5. WHEN a user selects a CSS file, THE System SHALL load the content into the CSS tab and switch to multi-file mode
6. WHEN a user selects a JavaScript file, THE System SHALL load the content into the JavaScript tab and switch to multi-file mode
7. THE System SHALL support drag-and-drop file upload onto the Editor area
8. IF the file size exceeds 500KB, THEN THE System SHALL display an error message and prevent loading

### Requirement 8: File Download

**User Story:** As a developer, I want to download my snippet as an HTML file, so that I can save it locally or use it elsewhere.

#### Acceptance Criteria

1. THE System SHALL provide a download button
2. WHEN a user clicks download in single-file mode, THE System SHALL generate an HTML file with the current content
3. WHEN a user clicks download in multi-file mode, THE System SHALL generate an HTML file with inline CSS and JavaScript
4. THE System SHALL trigger a browser download with filename format "snippet-[timestamp].html"
5. THE Downloaded_File SHALL contain valid HTML that renders identically to the Preview_Pane

### Requirement 9: Layout and Responsiveness

**User Story:** As a developer, I want a resizable split-pane layout, so that I can adjust the editor and preview sizes to my preference.

#### Acceptance Criteria

1. THE Split_Pane SHALL display the Editor on the left and Preview_Pane on the right
2. THE Split_Pane SHALL provide a draggable divider between Editor and Preview_Pane
3. WHEN a user drags the divider, THE System SHALL resize both panes in real-time
4. THE System SHALL persist the Split_Pane ratio to localStorage
5. WHEN the viewport width is below 768px, THE System SHALL stack the Editor above the Preview_Pane vertically
6. WHEN in mobile layout, THE System SHALL provide a toggle to switch between Editor and Preview_Pane views

### Requirement 10: Theme Support

**User Story:** As a developer, I want to switch between dark and light themes, so that I can work comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE System SHALL provide a theme toggle button
2. THE System SHALL support dark theme and light theme
3. WHEN a user clicks the theme toggle, THE System SHALL switch between dark and light themes
4. THE Editor SHALL apply the selected theme to syntax highlighting
5. THE System SHALL apply the selected theme to the application UI
6. THE System SHALL persist the theme preference to localStorage
7. WHEN a user opens the application, THE System SHALL load the saved theme preference

### Requirement 11: Error Handling

**User Story:** As a developer, I want clear error messages, so that I can understand what went wrong and how to fix it.

#### Acceptance Criteria

1. IF the Storage_Service is unavailable, THEN THE System SHALL display "Unable to connect to database" and allow continued local editing
2. IF a snippet fails to load, THEN THE System SHALL display "Failed to load snippet" with the error details
3. IF a snippet fails to save, THEN THE System SHALL display "Failed to save snippet" and retain the code in the Editor
4. IF a file upload fails, THEN THE System SHALL display "Failed to upload file" with the reason
5. THE System SHALL log all errors to the browser console for debugging

### Requirement 12: Performance

**User Story:** As a developer, I want the application to respond quickly, so that my workflow is not interrupted.

#### Acceptance Criteria

1. WHEN the application loads, THE System SHALL display the Editor within 2 seconds
2. WHEN switching between tabs in multi-file mode, THE Editor SHALL update within 100ms
3. WHEN resizing the Split_Pane, THE System SHALL update the layout within 16ms (60fps)
4. WHEN loading a snippet from a Share_URL, THE System SHALL populate the Editor within 1 second
5. THE System SHALL debounce preview updates to prevent excessive re-renders

### Requirement 13: Parser and Serializer

**User Story:** As a developer, I want the system to correctly parse and serialize code snippets, so that shared snippets render identically for all users.

#### Acceptance Criteria

1. WHEN saving a snippet, THE Serializer SHALL convert the Editor content into a JSON payload
2. WHEN loading a snippet, THE Parser SHALL convert the JSON payload into Editor content
3. THE Serializer SHALL escape special characters in HTML, CSS, and JavaScript content
4. THE Parser SHALL unescape special characters when loading content
5. THE Pretty_Printer SHALL format snippet JSON for storage in the Storage_Service
6. FOR ALL valid snippet objects, parsing then serializing then parsing SHALL produce an equivalent object (round-trip property)
7. IF the Parser encounters invalid JSON, THEN THE System SHALL display "Invalid snippet data" and load an empty editor

