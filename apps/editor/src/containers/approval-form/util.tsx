export const getQueryVariable = (variableString: string) => {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] === variableString) {
        return pair[1];
      }
    }
    return '';
  };
  