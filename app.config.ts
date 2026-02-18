export default defineAppConfig({
  ui: {
    colors: {
      primary: 'ice',
      secondary: 'forest',
      warning: 'powder',
      error: 'ember',
      neutral: 'mountain'
    },
    card: {
      variants: {
        variant: {
          outline: {
            root: 'bg-default shadow-sm ring-0 dark:ring-1 dark:ring-mountain-700 divide-y divide-default flex flex-col',
              body: 'flex-1'
          }
        }
      }
    }
  }
})
