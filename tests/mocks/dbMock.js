const dbMock = {
  query: jest.fn(),
  execute: jest.fn(),
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn()
};

// Mock para resultados de query
const mockQueryResult = (rows = [], insertId = null) => {
  return [rows, { insertId }];
};

// Mock para resultados de INSERT
const mockInsertResult = (insertId) => {
  return [{ insertId }, {}];
};

// Mock para resultados de UPDATE/DELETE
const mockUpdateResult = (affectedRows = 1) => {
  return [{ affectedRows }, {}];
};

module.exports = {
  dbMock,
  mockQueryResult,
  mockInsertResult,
  mockUpdateResult
}; 