import signModel from './signModel';

export default <T>(models: T) => {
  const mixState: any = {};
  for (let [namespace, model] of Object.entries(models)) {
    mixState[namespace] = signModel(model, namespace);
  }
  return mixState;
}
