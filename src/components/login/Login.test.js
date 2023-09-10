import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Login from './Login';

// 使用 jest.mock() 函数来模拟 Axios 库。它告诉 Jest 在测试中将 Axios 替换为一个模拟的版本。
// 第一个参数 "axios" 是要模拟的模块的名称，第二个参数是一个函数，返回一个模拟的模块对象。
// 这里模拟测试了axios的get方法返回值是否是正确的格式
jest.mock('axios', () => ({
  // 设置模块的 __esModule 属性为 true。这是一个用于标识模块是否符合 ES6 模块规范的属性。
  __esModule: true,
  // 定义了一个模拟的 Axios 对象，包含一个名为 default 的属性，它的值是一个对象。
  default: {
    // 在模拟的 Axios 对象中，我们定义了一个 get 方法，该方法返回一个包含模拟数据的对象。
    // 这意味着当测试代码中调用 Axios 的 get 方法时，实际上会返回一个包含 { id: 1, name: "John" } 数据的对象，而不会进行实际的 HTTP 请求。
    get: () => ({
      data: { id: 1, name: 'John' },
    }),
  },
}));

test('username input should be rendered', () => {
  // 使用 @testing-library/react 的 render 函数来渲染一个名为 Login 的 React 组件。这是将你的组件呈现到虚拟 DOM 中的步骤。
  // （1）模拟测试了<Login/>组件是否正确渲染
  render(<Login />);
  // 使用 screen.getByPlaceholderText() 函数从渲染后的虚拟 DOM 中获取一个元素。
  // 它通过输入框的 placeholder 文本内容来查找元素，/username/i 是一个正则表达式，表示不区分大小写匹配包含 "username" 文本的元素。
  // （2）模拟测试了<Login/>组件中 username input 元素是否存在
  const usernameInputEl = screen.getByPlaceholderText(/username/i);
  // 使用 Jest 的 expect 函数来进行断言。它断言 usernameInputEl 元素是否存在于虚拟 DOM 中。
  expect(usernameInputEl).toBeInTheDocument();
});

test('password input should be rendered', () => {
  render(<Login />);
  const passwordInputEl = screen.getByPlaceholderText(/password/i);
  expect(passwordInputEl).toBeInTheDocument();
});

test('button should be rendered', () => {
  // （1）模拟测试了<Login/>组件是否正确渲染
  render(<Login />);
  // （2）模拟测试了<Login/>组件中是否存在<button>元素，因为button没有placeholder，所以可以通过screen.getByRole() 函数从虚拟 DOM 中获取一个按钮元素
  const buttonEl = screen.getByRole('button');
  expect(buttonEl).toBeInTheDocument();
});

test('username input should be empty', () => {
  render(<Login />);
  const usernameInputEl = screen.getByPlaceholderText(/username/i);
  // 模拟测试<Login/>组件中 username input 元素的默认值是否为空
  expect(usernameInputEl.value).toBe('');
});

test('password input should be empty', () => {
  render(<Login />);
  const passwordInputEl = screen.getByPlaceholderText(/password/i);
  expect(passwordInputEl.value).toBe('');
});

test('button should be disabled', () => {
  render(<Login />);
  // 模拟测试了<Login/>组件中是否存在<button>元素
  const buttonEl = screen.getByRole('button');
  // 测试<button>元素的默认值是否处于禁用状态
  expect(buttonEl).toBeDisabled();
});

// 测试 React 组件中是否存在一个按钮元素，并验证按钮元素的文本内容是否不包含 "please wait" 字符串的测试用例。
test('loading should not be rendered', () => {
  render(<Login />);
  const buttonEl = screen.getByRole('button');
  expect(buttonEl).not.toHaveTextContent(/please wait/i);
});

test('error message should not be visible', () => {
  render(<Login />);
  const errorEl = screen.getByTestId('error');
  expect(errorEl).not.toBeVisible();
});

test('username input should change', () => {
  render(<Login />);
  const usernameInputEl = screen.getByPlaceholderText(/username/i);
  const testValue = 'test';

  fireEvent.change(usernameInputEl, { target: { value: testValue } });
  expect(usernameInputEl.value).toBe(testValue);
});

test('password input should change', () => {
  render(<Login />);
  const passwordInputEl = screen.getByPlaceholderText(/password/i);
  const testValue = 'test';

  fireEvent.change(passwordInputEl, { target: { value: testValue } });
  expect(passwordInputEl.value).toBe(testValue);
});

test('button should not be disabled when inputs exist', () => {
  render(<Login />);
  const buttonEl = screen.getByRole('button');
  const usernameInputEl = screen.getByPlaceholderText(/username/i);
  const passwordInputEl = screen.getByPlaceholderText(/password/i);

  const testValue = 'test';

  fireEvent.change(usernameInputEl, { target: { value: testValue } });
  fireEvent.change(passwordInputEl, { target: { value: testValue } });

  expect(buttonEl).not.toBeDisabled();
});

test('loading should be rendered when click', () => {
  render(<Login />);
  const buttonEl = screen.getByRole('button');
  const usernameInputEl = screen.getByPlaceholderText(/username/i);
  const passwordInputEl = screen.getByPlaceholderText(/password/i);

  const testValue = 'test';

  fireEvent.change(usernameInputEl, { target: { value: testValue } });
  fireEvent.change(passwordInputEl, { target: { value: testValue } });
  fireEvent.click(buttonEl);

  expect(buttonEl).toHaveTextContent(/please wait/i);
});

test('loading should not be rendered after fetching', async () => {
  render(<Login />);
  const buttonEl = screen.getByRole('button');
  const usernameInputEl = screen.getByPlaceholderText(/username/i);
  const passwordInputEl = screen.getByPlaceholderText(/password/i);

  const testValue = 'test';

  fireEvent.change(usernameInputEl, { target: { value: testValue } });
  fireEvent.change(passwordInputEl, { target: { value: testValue } });
  fireEvent.click(buttonEl);

  await waitFor(() => expect(buttonEl).not.toHaveTextContent(/please wait/i));
});

test('user should be rendered after fetching', async () => {
  render(<Login />);
  const buttonEl = screen.getByRole('button');
  const usernameInputEl = screen.getByPlaceholderText(/username/i);
  const passwordInputEl = screen.getByPlaceholderText(/password/i);

  const testValue = 'test';

  fireEvent.change(usernameInputEl, { target: { value: testValue } });
  fireEvent.change(passwordInputEl, { target: { value: testValue } });
  fireEvent.click(buttonEl);

  const userItem = await screen.findByText('John');

  expect(userItem).toBeInTheDocument();
});
