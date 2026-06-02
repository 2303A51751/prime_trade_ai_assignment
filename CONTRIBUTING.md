# Contributing to Prime AI

## Getting Started

1. Clone the repository
2. Follow [QUICKSTART.md](QUICKSTART.md) to set up locally
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Test thoroughly
6. Commit with clear messages: `git commit -m "Add feature description"`
7. Push to your branch: `git push origin feature/your-feature`
8. Submit a pull request

## Code Style

### Backend (Node.js)
- Use ES6+ syntax
- Follow the existing folder structure
- Add JSDoc comments for functions
- Use const/let (no var)
- Proper error handling with try-catch

### Frontend (React)
- Use functional components with hooks
- Follow React best practices
- Add PropTypes or TypeScript
- Keep components small and focused
- Use meaningful variable names

## Testing

### Backend
```bash
npm test
npm test -- --coverage
```

### Frontend
```bash
npm test
```

## Commit Messages

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for test additions

Example: `feat: add task filtering by priority`

## Pull Request Process

1. Update documentation if needed
2. Add/update tests
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Provide clear PR description

## Security

Report security vulnerabilities to security@primetrade.ai (don't use issues)

## Questions?

Open an issue or check the documentation files.

Thank you for contributing!
