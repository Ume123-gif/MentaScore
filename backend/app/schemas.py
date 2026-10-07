from typing import List, Literal
from pydantic import BaseModel, ConfigDict, Field

class PredictRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    age: int = Field(ge=13, le=100)
    gender: Literal["Male", "Female"]
    country: str = Field(min_length=1)
    academicLevel: Literal["High School", "Undergraduate", "Graduate"]
    mostUsedPlatform: Literal["Facebook", "Instagram", "KakaoTalk", "LINE", "LinkedIn", "Snapchat", "TikTok", "Twitter", "VKontakte", "WeChat", "WhatsApp", "YouTube"]
    purposeOfUse: Literal["Education", "Entertainment", "Networking", "News"]
    avgDailyUsageHours: float = Field(ge=0, le=24)
    dailyUnlocks: int = Field(ge=0, le=1000)
    studyHours: float = Field(ge=0, le=24)
    physicalActivityHours: float = Field(ge=0, le=24)
    sleepHoursPerNight: float = Field(ge=0, le=24)
    stressLevel: Literal["Low", "Medium", "High", "Very High"]

class Contribution(BaseModel):
    label: str
    value: float

class PredictResponse(BaseModel):
    score: float
    contributions: List[Contribution]
    source: str
