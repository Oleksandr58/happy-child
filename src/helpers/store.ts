const getStore = () => localStorage.getItem("allData");

const saveAction = (id, isCheck) => {
  const store = JSON.parse(getStore());
  const storeModified = store ? { ...store, [id]: isCheck } : { [id]: isCheck };

  localStorage.setItem("allData", JSON.stringify(storeModified));
};

const getIsCheckAction = (id) => {
  const store = getStore();

  if (id === "02.05.2025-washEyes-0") {
    console.log("id", id, JSON.parse(store), JSON.parse(store)?.[id]);
  }

  return JSON.parse(store)?.[id];
};

export { saveAction, getIsCheckAction };
export default {};
