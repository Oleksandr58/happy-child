const getStore = () => localStorage.getItem("allData");

const saveAction = (id: string, isCheck: boolean) => {
  const store = getStore();
  const storeModified = store ? { ...JSON.parse(store), [id]: isCheck } : { [id]: isCheck };

  localStorage.setItem("allData", JSON.stringify(storeModified));
};

const getIsCheckAction = (id: string): boolean => {
  const store = getStore();

  return Boolean(store && JSON.parse(store)?.[id]);
};

export { saveAction, getIsCheckAction };
export default {};
