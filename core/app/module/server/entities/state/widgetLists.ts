// import { Widget } from '../..';
// export type WidgetList = Record<string, boolean>; // Boolean need to reload;

// export const getWidgetList = (widgets: Widget[]): WidgetList => {
//   const widgetList: WidgetList = {};

//   const constWidget = (widgets) => {
//     widgets.forEach((widget: Widget) => {
//       const { name, slots = {} } = widget;
//       const isDev = widgetList[name] ? widgetList[name] : widget.isDev;
//       widgetList[name] = Boolean(isDev);
//       Object.keys(slots).forEach((slotName) => {
//         constWidget(slots[slotName]);
//       });
//     });
//   };
//   constWidget(widgets);

//   return widgetList;
// };
