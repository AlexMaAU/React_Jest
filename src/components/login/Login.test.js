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
  // 使用 screen.getByTestId() 函数从虚拟 DOM 中获取一个具有 data-testid 属性值为 'error' 的元素。
  const errorEl = screen.getByTestId('error');
  // 断言 errorEl 元素默认不可见。
  expect(errorEl).not.toBeVisible();
});

// 测试 React 组件中的输入框元素是否能够响应用户输入并正确地改变其值
test('username input should change', () => {
  render(<Login />);
  const usernameInputEl = screen.getByPlaceholderText(/username/i);
  const testValue = 'test';
  // 使用 @testing-library/react 的 fireEvent.change() 函数来模拟用户在输入框中输入值的行为。
  // 它模拟了用户在 usernameInputEl 输入框中输入了 testValue。
  // { target: { value: testValue } }：这是一个事件对象的配置，事件对象（Event Object）通常包含一个属性叫做 target，它指向触发事件的DOM元素，它模拟了一个包含 value 属性的事件对象。value 属性用于表示输入框的当前值。
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

// 测试了在点击按钮后，是否会显示一个带有 "please wait" 文本的加载状态
test('loading should be rendered when click', () => {
  render(<Login />);
  // 从虚拟 DOM 中获取一个按钮元素
  const buttonEl = screen.getByRole('button');
  // 需要先从虚拟DOM中获取到要测试的元素
  const usernameInputEl = screen.getByPlaceholderText(/username/i);
  const passwordInputEl = screen.getByPlaceholderText(/password/i);

  const testValue = 'test';
  // 模拟用户在用户名输入框和密码输入框中输入了 testValue，即 'test'。这模拟了用户输入用户名和密码的操作。
  fireEvent.change(usernameInputEl, { target: { value: testValue } });
  fireEvent.change(passwordInputEl, { target: { value: testValue } });
  // 使用 fireEvent.click() 函数模拟用户点击按钮的操作，触发按钮的点击事件。
  fireEvent.click(buttonEl);
  // 断言 buttonEl 元素是否包含文本内容匹配正则表达式 /please wait/i。如果按钮元素的文本内容包含 "please wait" 字符串，测试将通过；如果不包含，测试将失败，表明加载状态的渲染与预期不符。
  expect(buttonEl).toHaveTextContent(/please wait/i);
});

// 测试 React 组件中的交互行为的测试用例，特别是测试在执行某个操作后，是否会在一定时间后，不再显示加载状态的文本 "please wait"。
test('loading should not be rendered after fetching', async () => {
  render(<Login />);
  const buttonEl = screen.getByRole('button');
  const usernameInputEl = screen.getByPlaceholderText(/username/i);
  const passwordInputEl = screen.getByPlaceholderText(/password/i);

  const testValue = 'test';

  fireEvent.change(usernameInputEl, { target: { value: testValue } });
  fireEvent.change(passwordInputEl, { target: { value: testValue } });
  fireEvent.click(buttonEl);
  // 使用 await 关键字，等待一定时间（或者等待特定条件满足）。waitFor() 函数是一个辅助函数，它用于等待某个条件成立。
  // 在这里，我们等待一个条件：期望 buttonEl 元素不再包含文本内容匹配正则表达式 /please wait/i，即不再显示加载状态文本 "please wait"。
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

  // 使用 screen.findByText() 函数等待页面上出现包含文本 "John" 的元素。
  // 这是一个异步操作，会等待一定时间直到找到匹配的元素。一旦找到符合条件的元素，它将赋值给 userItem 变量。
  // await screen.findByText('John') 的目的不是要查找实际存在于页面上的文本 "John"，而是要模拟在异步操作后，Login 组件会获取用户数据并将用户名 "John" 渲染到界面上。
  const userItem = await screen.findByText('John');

  expect(userItem).toBeInTheDocument();
});
