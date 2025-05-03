const handleDeleteTeam = () => {
  if (selectedTeam) {
    console.log('Before dispatch - selectedTeam:', selectedTeam);
    dispatch(deleteTeam(selectedTeam));
    console.log('After dispatch - selectedTeam:', selectedTeam);
    toast({
      title: 'Team deleted',
      description: 'The team has been successfully deleted',
    });
    setIsDeleteDialogOpen(false);
  } else {
    console.log('No team selected for deletion');
  }
};
