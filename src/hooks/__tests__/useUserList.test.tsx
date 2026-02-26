/// <reference types="vitest" />
import { render, act } from '@testing-library/react';
import { useUserList, UserInfo } from '../useUserList';

describe('useUserList hook', () => {
  const sample: UserInfo = { name: 'Alice', avatar: 'a.png', intro: 'hello' };

  function setup(initial: UserInfo[] = []) {
    let hookValue: ReturnType<typeof useUserList>;
    const Component = () => {
      hookValue = useUserList(initial);
      return null;
    };
    const { rerender } = render(<Component />);
    return {
      get value() {
        return hookValue!;
      },
      rerender,
    };
  }

  it('starts with initial users and assigns ids', () => {
    const { value } = setup([sample]);
    expect(value.userList.length).toBe(1);
    expect(value.userList[0].name).toBe('Alice');
    expect(value.userList[0].id).toBeDefined();
  });

  it('can add a new user', () => {
    const result = setup();
    act(() => {
      result.value.addNewUser(sample);
    });
    result.rerender();
    expect(result.value.userList).toHaveLength(1);
    expect(result.value.userList[0].name).toBe('Alice');
  });

  it('can delete a user by name', () => {
    const result = setup([sample]);
    act(() => {
      result.value.deleteUser('Alice');
    });
    result.rerender();
    expect(result.value.userList).toHaveLength(0);
  });

  it('updates intro for matching name', () => {
    const result = setup([sample]);
    act(() => {
      result.value.updateUserIntro('Alice', 'new intro');
    });
    result.rerender();
    expect(result.value.userList[0].intro).toBe('new intro');
  });
});
