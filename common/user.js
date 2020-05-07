export default {
	token:"4cd36bf706049475ac0cd6fae78250954474a4350",
	userinfo:false,
	navigate(options,type="navigateTo"){
		if(!this.token) {
			return uni.navigateTo({url:'/pages/login/login'})
			
			
		}
		switch (type){
			case "navigateTo":
			uni.navigateTo(options);
				break;
			case "redirectTo":
			uni.redirectTo(options);
				break;
			case "reLaunch":
			uni.reLaunch(options);
				break;
			case "switchTab":
			uni.switchTab(options);
				break;
		}
		
	}
}